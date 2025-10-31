import React, { useEffect, useMemo, useState } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import { Pencil, Trash } from 'lucide-react';

import { CONFIG } from "../../config";

const endpointSalas = `${CONFIG.API_URL}/salas/all`;
const endpointReservas = `${CONFIG.API_URL}/salaReservada/findSalas`;

function toDate(d) { return d ? new Date(d) : null; }
function overlap(aStart, aEnd, bStart, bEnd) { return aStart < bEnd && bStart < aEnd; }

export function SalasReservadasCalendar() {
    const [salasList, setSalasList] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState("dia");
    const [baseDate, setBaseDate] = useState(() => {
        const d = new Date(); d.setHours(0, 0, 0, 0); return d.toISOString().slice(0, 10);
    });
    const [editingReserva, setEditingReserva] = useState(null);

    const [checkDate, setCheckDate] = useState("");
    const [checkTime, setCheckTime] = useState("");
    const [checkResult, setCheckResult] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const quem_reservou = user?.nome || "Erro";
    
    function formatDateTimeLocal(dateStr) {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const pad = (n) => String(n).padStart(2, "0");

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    useEffect(() => {
        const controller = new AbortController();
        async function fetchAll() {
            try {
                setLoading(true);
                const [rSalas, rReservas] = await Promise.all([
                    fetch(endpointSalas, { signal: controller.signal }),
                    fetch(endpointReservas, { signal: controller.signal }),
                ]);

                if (!rSalas.ok) throw new Error("Erro ao buscar salas");
                if (!rReservas.ok) throw new Error("Erro ao buscar reservas");

                const salasData = await rSalas.json();
                const reservasData = await rReservas.json();

                setSalasList(Array.isArray(salasData) ? salasData : []);
                setReservas(Array.isArray(reservasData) ? reservasData : []);
            } catch (err) {
                if (err.name !== "AbortError") console.error("fetchAll error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchAll();
        return () => controller.abort();
    }, []);

    // ---------- associação: pegar salas do endpoint /salas e anexar reservas correspondentes ----------
    // Retorna um objeto { salas: [...], unmatchedReservations: [...] }
    const { salas, unmatchedReservations } = useMemo(() => {
        const getSalaId = (o) => o?.id ?? o?.id_salas ?? o?.salaid ?? o?.id_sala ?? o?.salaId ?? null;
        const getNomeSala = (o) => o?.nome_sala ?? o?.nome ?? o?.descricao ?? "Sala";

        const map = new Map();

        // 1) criar entradas a partir do endpoint /salas (garante que só salas oficiais aparecem)
        salasList.forEach((s, idx) => {
            const id = getSalaId(s);
            const key = id !== null && id !== undefined ? String(id) : `__sala_noid_${idx}`;
            map.set(key, {
                _key: key,
                id: id ?? null,
                nome: getNomeSala(s),
                raw: s,
                reservas: []
            });
        });

        // 2) percorrer as reservas e anexar às salas existentes quando houver correspondência
        const unmatched = [];
        reservas.forEach((r, idx) => {
            const reservation = { ...r, start: toDate(r.data_inicio), end: toDate(r.data_fim) };
            const salaIdFromReserva = getSalaId(r);
            if (salaIdFromReserva !== null && salaIdFromReserva !== undefined) {
                const key = String(salaIdFromReserva);
                const salaEntry = map.get(key);
                if (salaEntry) {
                    salaEntry.reservas.push(reservation);
                } else {
                    unmatched.push(reservation);
                }
            } else {
                unmatched.push(reservation);
            }
        });

        return { salas: Array.from(map.values()), unmatchedReservations: unmatched };
    }, [salasList, reservas]);

    const weekDays = useMemo(() => {
        const base = new Date(baseDate + "T00:00:00");
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(base);
            d.setDate(base.getDate() + i);
            days.push(d);
        }
        return days;
    }, [baseDate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-80">
                <SyncLoader color="#111827" speedMultiplier={1} />
            </div>
        );
    }

    const dayStartHour = 7, dayEndHour = 22;
    const hours = [];
    for (let h = dayStartHour; h <= dayEndHour; h++) hours.push(h);

    function computeStyleForReservation(reservation, referenceDate) {
        const dayStart = new Date(referenceDate); dayStart.setHours(dayStartHour, 0, 0, 0);
        const dayEnd = new Date(referenceDate); dayEnd.setHours(dayEndHour, 0, 0, 0);
        const start = reservation.start, end = reservation.end;
        if (!start || !end) return null;
        const s = start < dayStart ? dayStart : start;
        const e = end > dayEnd ? dayEnd : end;
        if (e <= s) return null;
        const minutesTotal = (dayEnd - dayStart) / 60000;
        const leftMin = (s - dayStart) / 60000;
        const durMin = (e - s) / 60000;
        return { left: `${(leftMin / minutesTotal) * 100}%`, width: `${(durMin / minutesTotal) * 100}%` };
    }

    function computeStyleForReservationWeek(reservation) {
        if (!reservation || !reservation.start || !reservation.end) return null;
        const days = weekDays.map(d => (d instanceof Date ? d : new Date(d)));

        const msPerDay = 24 * 60 * 60 * 1000;

        const startDayMs = new Date(reservation.start).setHours(0, 0, 0, 0);
        const endDayMs = new Date(reservation.end).setHours(0, 0, 0, 0);

        const firstDayMs = new Date(days[0]).setHours(0, 0, 0, 0);
        const lastDayMs = new Date(days[days.length - 1]).setHours(0, 0, 0, 0);

        if (endDayMs < firstDayMs || startDayMs > lastDayMs) return null;

        const startIdx = Math.max(0, Math.floor((startDayMs - firstDayMs) / msPerDay));
        const endIdx = Math.min(days.length - 1, Math.floor((endDayMs - firstDayMs) / msPerDay));

        const totalDays = days.length;
        const leftPercent = (startIdx / totalDays) * 100;
        const widthPercent = ((endIdx - startIdx + 1) / totalDays) * 100;

        return { left: `${leftPercent}%`, width: `${widthPercent}%`, startIdx, endIdx };
    }



    function fmtHour(date) { if (!date) return ""; return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
    function fmtDate(date) { if (!date) return ""; return new Date(date).toLocaleDateString("pt-BR"); }

    function getResponsible(r) { return r.responsavel_nome ?? r.responsavel ?? r.responsavel_id ?? "Responsável"; }

    function checkAvailabilityAt(isoDate, timeStr) {
        if (!isoDate || !timeStr) return null;
        const [y, m, d] = isoDate.split("-").map(Number);
        const [hh, mm] = timeStr.split(":").map(Number);
        const target = new Date(y, m - 1, d, hh, mm, 0, 0);
        return salas.map(s => ({
            salaKey: s._key,
            nome: s.nome,
            occupied: s.reservas.some(r => r.start && r.end && r.start <= target && target < r.end)
        }));
    }

    function handleCheck(e) {
        e?.preventDefault();
        setCheckResult(checkAvailabilityAt(checkDate, checkTime));
    }

    const blockStyle = {
        background: "linear-gradient(90deg,#1e3a8a,#2563eb)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
    };

    async function handleDelete(id_reserva) {
        try {
            // const response = await fetch(`http://localhost:3001/salaReservada/delete/${id_reserva}`, {
            //     method: "DELETE",
            // })
            const response = await fetch(`${CONFIG.API_URL}/usuarios/${id_reserva}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                console.log(response)
            }
            setReservas(prev => prev.filter(r => r.id_reserva !== id_reserva));

            alert("Reserva deletada com sucesso")
        } catch (error) {
            console.error(error)
        }

    }

    const handleEdit = async (editedReserva) => {
        const formData = new FormData();
        formData.append("id_reserva", editedReserva.id_reserva);
        formData.append("id_sala", editedReserva.id_sala);
        formData.append("responsavel", editedReserva.responsavel);
        formData.append("data_inicio", editedReserva.data_inicio);
        formData.append("data_fim", editedReserva.data_fim);
        formData.append("descricao", editedReserva.descricao);
        formData.append("quem_reservou", quem_reservou);

        console.log("Edited reservation:", formData.get("quem_reservou"));


        try {
            const response = await fetch(`${CONFIG.API_URL}/salaReservada/update/${editedReserva.id_reserva}`, {
                method: "PUT",
                body: formData,

            });

            if (!response.ok) {
                await response.json();
                return;
            }

            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    const openEditModal = (reserva) => {
        setEditingReserva({ ...reserva });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingReserva(null);
        setIsModalOpen(false);
    };

    const handleSaveReserva = () => {
        if (!editingReserva.responsavel || !editingReserva.data_inicio || !editingReserva.data_fim || !editingReserva.descricao) {
            return;
        }
        console.log(editingReserva);


        handleEdit(editingReserva);
        closeModal();
    };


    return (
        <div className="w-full">
            <div className="max-w-full mx-auto p-3 sm:p-4 lg:p-6 overflow-auto" style={{ maxHeight: '700px' }}>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-between items-center mb-4">
                    <div className="flex gap-2">
                        <button className={`px-4 py-2 rounded text-sm sm:text-base ${mode === "dia" ? "bg-sky-700 text-white" : "bg-slate-100"}`} onClick={() => setMode("dia")}>Dia (horas)</button>
                        <button className={`px-4 py-2 rounded text-sm sm:text-base ${mode === "semana" ? "bg-sky-700 text-white" : "bg-slate-100"}`} onClick={() => setMode("semana")}>Semana</button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <label className="text-sm font-medium whitespace-nowrap">Data base:</label>
                        <input type="date" value={baseDate} onChange={(e) => setBaseDate(e.target.value)} className="border rounded px-2 py-1 text-sm" />
                    </div>

                    <form onSubmit={handleCheck} className="flex flex-wrap items-center gap-2">
                        <label className="text-sm">Verificar</label>
                        <input type="date" value={checkDate} onChange={(e) => setCheckDate(e.target.value)} className="border px-2 py-1 rounded text-sm" />
                        <input type="time" value={checkTime} onChange={(e) => setCheckTime(e.target.value)} className="border px-2 py-1 rounded text-sm" />
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Verificar</button>
                    </form>
                </div>

                {checkResult && (
                    <div className="mb-4 text-sm">
                        <strong>Resultado da verificação ({checkDate} {checkTime}):</strong>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {checkResult.map(r => (
                                <div key={r.salaKey} className={`p-2 rounded border ${r.occupied ? "bg-red-100 border-red-300" : "bg-green-50 border-green-200"}`}>
                                    <div className="text-sm font-medium">{r.nome}</div>
                                    <div className="text-xs">{r.occupied ? "Ocupada" : "Livre"}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {unmatchedReservations.length > 0 && (
                    <div className="mb-4 p-3 rounded border bg-yellow-50 text-sm">
                        <strong>Atenção:</strong> {unmatchedReservations.length} reserva(s) não correspondem a nenhuma sala.
                    </div>
                )}

                {isModalOpen && editingReserva && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
                        <div className="relative bg-white w-full sm:w-[90%] max-w-md sm:max-w-lg p-6 rounded-2xl shadow-lg z-10 overflow-y-auto max-h-[90vh]">
                            <h2 className="text-xl font-semibold mb-4">Editar Reserva</h2>

                            <div className="flex flex-col gap-3 text-sm">
                                <label className="flex flex-col">
                                    <span className="text-gray-700">Responsável</span>
                                    <input type="text" name="responsavel"
                                        value={editingReserva.responsavel ?? ""}
                                        onChange={(e) => setEditingReserva({ ...editingReserva, responsavel: e.target.value })}
                                        className="border rounded px-2 py-1" />
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-gray-700">Data Início</span>
                                    <input type="datetime-local" name="data_inicio"
                                        value={formatDateTimeLocal(editingReserva.data_inicio) ?? ""}
                                        onChange={(e) => setEditingReserva({ ...editingReserva, data_inicio: e.target.value })}
                                        className="border rounded px-2 py-1" />
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-gray-700">Data Fim</span>
                                    <input type="datetime-local" name="end"
                                        value={formatDateTimeLocal(editingReserva.data_fim) ?? ""}
                                        min={editingReserva.data_inicio}
                                        disabled={!editingReserva.data_inicio}
                                        onChange={(e) => setEditingReserva({ ...editingReserva, data_fim: e.target.value })}
                                        className="border rounded px-2 py-1" />
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-gray-700">Descrição</span>
                                    <textarea name="descricao" value={editingReserva.descricao ?? ""}
                                        onChange={(e) => setEditingReserva({ ...editingReserva, descricao: e.target.value })}
                                        className="border rounded px-2 py-1 resize-y min-h-[80px]" placeholder="Digite uma breve descrição..." maxLength={200} />
                                    <p className="text-xs text-gray-500">{editingReserva.descricao?.length ?? 0}/200</p>
                                </label>
                            </div>

                            <div className="mt-6 flex items-center justify-end space-x-3">
                                <button
                                    className="ml-3 flex items-center border justify-center bg-red-600 border-red-600/0 text-white w-7 h-7 rounded-full hover:bg-white/20 hover:text-red-600 hover:border-red-600  transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm("Deseja editar esta reserva?")) {
                                            handleDelete(editingReserva.id_reserva);
                                            closeModal();
                                        }
                                    }}
                                    title="Editar reserva"
                                >
                                    <Trash size={14} />
                                </button>
                                <button className="px-4 py-2 rounded border border-red-600/0 bg-red-600 text-white hover:bg-red-200 hover:text-red-600 hover:border-red-600 transition" onClick={closeModal}>Cancelar</button>
                                <button className="px-4 py-2 rounded border border-blue-600/0 bg-blue-600 text-white hover:bg-blue-200 hover:text-blue-600 hover:border-blue-600 transition" onClick={handleSaveReserva}>Salvar</button>
                            </div>
                        </div>
                    </div>
                )}


                <div className="overflow-x-auto border rounded shadow-sm mt-4">
                    <div className="min-w-[700px] sm:min-w-[900px]">


                        {mode === "dia" ? (
                            <div className="min-w-[900px]">
                                <div className="sticky top-0 bg-white z-10 border-b">
                                    <div className="grid" style={{ gridTemplateColumns: `200px repeat(${hours.length}, 1fr)` }}>
                                        <div className="p-3 font-semibold">Salas / Horas</div>
                                        {hours.map(h => (
                                            <div key={h} className="p-2 text-center text-xs border-l text-gray-600 bg-gray-50">
                                                {h}:00
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    {salas.map(sala => (
                                        <div
                                            key={sala._key}
                                            className="grid items-start"
                                            style={{ gridTemplateColumns: `200px repeat(${hours.length}, 1fr)` }}
                                        >
                                            <div className="p-3 flex flex-col justify-center border-b border-r bg-gray-50/40">
                                                <div className="font-medium h-[8vh] flex items-center">{sala.nome}</div>
                                            </div>

                                            <div
                                                className="relative border-b border-r bg-white flex flex-col items-center"
                                                style={{ gridColumn: "2 / -1" }}
                                            >
                                                <div className="absolute inset-0 flex pointer-events-none">
                                                    {hours.map((_, idx) => (
                                                        <div key={idx} className="flex-1 border-l border-slate-100" />
                                                    ))}
                                                </div>

                                                {sala.reservas.map((r, idx) => {
                                                    const style = computeStyleForReservation(r, baseDate + "T00:00:00");
                                                    if (!style) return null;
                                                    const resKey = `${sala._key}-res-${r.id_reserva ?? r.id ?? idx}`;
                                                    const responsavel = getResponsible(r);

                                                    const startDateStr = fmtDate(r.start);
                                                    const endDateStr = fmtDate(r.end);
                                                    const dateLabel =
                                                        startDateStr === endDateStr ? startDateStr : `${startDateStr} → ${endDateStr}`;

                                                    return (
                                                        <div
                                                            key={resKey}
                                                            className="absolute top-2 h-20 rounded-xl text-white text-sm flex items-center justify-between px-3 shadow-md hover:shadow-lg transition-all duration-200"
                                                            style={{
                                                                left: style.left,
                                                                width: style.width,
                                                                background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                                                            }}
                                                        >
                                                            <div className="flex flex-col flex-1 leading-tight overflow-hidden">
                                                                <span className="font-semibold truncate">{responsavel}</span>
                                                                <span className="text-xs opacity-90 truncate">
                                                                    {dateLabel} · {fmtHour(r.start)} — {fmtHour(r.end)}
                                                                </span>
                                                            </div>

                                                            <button
                                                                className="ml-3 flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                                                onClick={() => openEditModal(r)}

                                                                title="Editar reserva"
                                                            >
                                                                <Pencil size={14} />
                                                            </button>

                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="min-w-[900px]">
                                <div className="sticky top-0 bg-white z-10 border-b">
                                    <div
                                        className="grid"
                                        style={{ gridTemplateColumns: `200px repeat(${weekDays.length}, 1fr)` }}
                                    >
                                        <div className="p-3 font-semibold">Salas / Dias</div>
                                        {weekDays.map((day) => (
                                            <div key={day.toISOString()} className="p-2 text-center text-xs border-l">
                                                <div>{day.toLocaleDateString()}</div>
                                                <div className="text-xs text-slate-500">
                                                    {day.toLocaleDateString(undefined, { weekday: "short" })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    {salas.map((sala) => (
                                        <div
                                            key={sala._key}
                                            className="grid items-start"
                                            style={{ gridTemplateColumns: `200px repeat(${weekDays.length}, 1fr)` }}
                                        >
                                            <div className="p-3 border-b h-[9vh] border-r bg-gray-50/40 flex items-center">
                                                <div className="font-medium">{sala.nome}</div>
                                            </div>

                                            {weekDays.map((day, dayIdx) => {
                                                const dayStart = new Date(day);
                                                dayStart.setHours(0, 0, 0, 0);
                                                const nextDay = new Date(dayStart);
                                                nextDay.setDate(nextDay.getDate() + 1);

                                                const reservasDia = sala.reservas.filter((r) =>
                                                    overlap(r.start, r.end, dayStart, nextDay)
                                                );

                                                return (
                                                    <div
                                                        key={dayIdx}
                                                        className="border-b border-r min-h-[9vh] flex flex-col items-center justify-center text-center relative"
                                                    >
                                                        {reservasDia.length > 0 ? (
                                                            reservasDia.map((r, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="w-11/12 h-[8vh] flex flex-col justify-center items-center rounded-lg text-white text-xs p-2 shadow-md mb-1"
                                                                    style={blockStyle}
                                                                >
                                                                    <div className="font-semibold truncate">
                                                                        {getResponsible(r)}
                                                                    </div>
                                                                    <div className="opacity-90 text-[11px] truncate">
                                                                        {fmtHour(r.start)} — {fmtHour(r.end)}
                                                                    </div>
                                                                    {r.descricao && r.descricao.trim() !== "" ? (
                                                                        <div className="opacity-90 text-[11px] truncate">
                                                                            {r.descricao}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="opacity-50 text-[11px] italic">Sem descrição</div>
                                                                    )}

                                                                    <button
                                                                        className="absolute top-2 left-4 bg-white/10 hover:bg-white/20 rounded p-1"
                                                                        onClick={() => openEditModal(r)}

                                                                        title="Editar reserva"
                                                                    >
                                                                        <Pencil size={12} />
                                                                    </button>
                                                                    <button
                                                                        className="absolute top-2 right-4 bg-white/10 hover:bg-white/20 rounded p-1"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            if (window.confirm("Deseja excluir esta reserva?")) {
                                                                                handleDelete(r.id_reserva);
                                                                            }
                                                                        }}
                                                                        title="Excluir reserva"
                                                                    >
                                                                        <Trash size={12} />
                                                                    </button>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-xs text-slate-400 select-none">
                                                                — livre —
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
