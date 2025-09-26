import React, { useEffect, useMemo, useState } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import { CONFIG } from "../config";

const endpointSalas = `${CONFIG.API_URL}/salas/all`;
const endpointReservas = `${CONFIG.API_URL}/salaReservada/findSalas`;

function toDate(d) { return d ? new Date(d) : null; }
function overlap(aStart, aEnd, bStart, bEnd) { return aStart < bEnd && bStart < aEnd; }

export default function SalasReservadasCalendar() {
    const [salasList, setSalasList] = useState([]);         
    const [reservas, setReservas] = useState([]);           
    const [loading, setLoading] = useState(true);           
    const [mode, setMode] = useState("dia");                
    const [baseDate, setBaseDate] = useState(() => {
        const d = new Date(); d.setHours(0,0,0,0); return d.toISOString().slice(0,10);
    });                                                     

    const [checkDate, setCheckDate] = useState("");         
    const [checkTime, setCheckTime] = useState("");         
    const [checkResult, setCheckResult] = useState(null);   

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
        const dayStart = new Date(referenceDate); dayStart.setHours(dayStartHour,0,0,0);
        const dayEnd = new Date(referenceDate); dayEnd.setHours(dayEndHour,0,0,0);
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

    function fmtHour(date) { if (!date) return ""; return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
    function fmtDate(date) { if (!date) return ""; return new Date(date).toLocaleDateString("pt-BR"); }

    function getResponsible(r) { return r.responsavel_nome ?? r.responsavel ?? r.responsavel_id ?? "Responsável"; }

    function checkAvailabilityAt(isoDate, timeStr) {
        if (!isoDate || !timeStr) return null;
        const [y,m,d] = isoDate.split("-").map(Number);
        const [hh,mm] = timeStr.split(":").map(Number);
        const target = new Date(y, m-1, d, hh, mm, 0, 0);
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

    return (
        <div className="w-full">
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <div className="flex items-center gap-2">
                <button className={`px-4 py-2 rounded ${mode==="dia"?"bg-sky-700 text-white":"bg-slate-100"}`} onClick={()=>setMode("dia")}>Dia (horas)</button>
                <button className={`px-4 py-2 rounded ${mode==="semana"?"bg-sky-700 text-white":"bg-slate-100"}`} onClick={()=>setMode("semana")}>Semana</button>
            </div>

            <div className="flex items-center gap-2">
                <label className="text-sm">Data base:</label>
                <input type="date" value={baseDate} onChange={(e)=>setBaseDate(e.target.value)} className="border rounded px-2 py-1" />
            </div>

            <form onSubmit={handleCheck} className="flex items-center gap-2">
                <label className="text-sm">Verificar</label>
                <input type="date" value={checkDate} onChange={(e)=>setCheckDate(e.target.value)} className="border px-2 py-1 rounded" />
                <input type="time" value={checkTime} onChange={(e)=>setCheckTime(e.target.value)} className="border px-2 py-1 rounded" />
                <button className="px-3 py-1 bg-blue-600 text-white rounded">Verificar</button>
            </form>
            </div>

            {checkResult && (
            <div className="mb-4">
                <strong>Resultado da verificação ({checkDate} {checkTime}):</strong>
                <div className="mt-2 grid grid-cols-2 gap-2">
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
                <strong>Atenção:</strong> {unmatchedReservations.length} reserva(s) não correspondem a nenhuma sala do endpoint <code>/salas</code>. Verifique os dados. (Não foram adicionadas ao calendário.)
            </div>
            )}

            <div className="overflow-auto border rounded shadow-sm">
            {mode === "dia" ? (
                <div className="min-w-[900px]">
                <div className="sticky top-0 bg-white z-10 border-b">
                    <div className="grid" style={{ gridTemplateColumns: `200px repeat(${hours.length}, 1fr)` }}>
                    <div className="p-3 font-semibold">Salas / Horas</div>
                    {hours.map(h => (<div key={h} className="p-2 text-center text-xs border-l">{h}:00</div>))}
                    </div>
                </div>

                <div>
                    {salas.map(sala => (
                    <div key={sala._key} className="grid items-start" style={{ gridTemplateColumns: `200px repeat(${hours.length}, 1fr)` }}>
                        <div className="p-3 border-b  border-r">
                        <div className="font-medium h-[8vh]">{sala.nome}</div>
                        </div>

                        <div className="relative h-18 border-b border-r" style={{ gridColumn: "2 / -1" }}>
                        <div className="absolute inset-0 flex pointer-events-none">
                            {hours.map((h, idx) => (<div key={idx} className="flex-1 border-l border-slate-100" />))}
                        </div>

                        {sala.reservas.map((r, idx) => {
                            const style = computeStyleForReservation(r, baseDate + "T00:00:00");
                            if (!style) return null;
                            const resKey = `${sala._key}-res-${r.id_reserva ?? r.id ?? idx}`;
                            const responsavel = getResponsible(r);

                            const startDateStr = fmtDate(r.start);
                            const endDateStr = fmtDate(r.end);
                            const dateLabel = startDateStr === endDateStr ? startDateStr : `${startDateStr} → ${endDateStr}`;

                            return (
                            <div
                                key={resKey}
                                title={`${responsavel} — ${dateLabel} — ${fmtHour(r.start)} — ${fmtHour(r.end)}`}
                                className="absolute top-3 h-14 rounded-md text-white text-sm flex items-center px-3 overflow-hidden"
                                style={{
                                left: style.left,
                                width: style.width,
                                ...blockStyle
                                }}
                            >
                                <div className="flex flex-col leading-tight">
                                <span className="font-semibold text-sm truncate">{responsavel}</span>
                                <span className="text-xs opacity-90">{dateLabel} · {fmtHour(r.start)} — {fmtHour(r.end)}</span>
                                </div>
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
                    <div className="grid" style={{ gridTemplateColumns: `200px repeat(${weekDays.length}, 1fr)` }}>
                    <div className="p-3 font-semibold">Salas / Dias</div>
                    {weekDays.map(d => (<div key={d.toISOString()} className="p-2 text-center text-xs border-l w-36"><div>{d.toLocaleDateString()}</div><div className="text-xs text-slate-500">{d.toLocaleDateString(undefined, { weekday: "short" })}</div></div>))}
                    </div>
                </div>

                <div>
                    {salas.map(sala => (
                    <div key={sala._key} className="grid items-start" style={{ gridTemplateColumns: `200px repeat(${weekDays.length}, 1fr)` }}>
                        <div className="p-3 border-b border-r h-28">
                        <div className="font-medium">{sala.nome}</div>
                        </div>

                        {weekDays.map(d => {
                        const dayStart = new Date(d); dayStart.setHours(0,0,0,0);
                        const dayEnd = new Date(d); dayEnd.setHours(23,59,59,999);
                        const reservasDoDia = sala.reservas.filter(r => r.start && r.end && overlap(r.start, r.end, dayStart, dayEnd));
                        return (
                            <div key={d.toISOString()} className="p-2 border-l border-b h-28 w-36">
                            {reservasDoDia.length === 0 ? (
                                <div className="text-xs text-slate-400">— livre —</div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                {reservasDoDia.map((r, i) => {
                                    const responsavel = getResponsible(r);
                                    const startDateStr = fmtDate(r.start);
                                    const endDateStr = fmtDate(r.end);
                                    const dateLabel = startDateStr === endDateStr ? startDateStr : `${startDateStr} → ${endDateStr}`;
                                    const keyRes = `${sala._key}-week-${d.toISOString()}-${i}`;
                                    return (
                                    <div
                                        key={keyRes}
                                        title={`${responsavel} — ${dateLabel} — ${fmtHour(r.start)} — ${fmtHour(r.end)}`}
                                        className="p-2 rounded text-sm text-white"
                                        style={{ minWidth: 120, ...blockStyle }}
                                    >
                                        <div className="font-semibold truncate">{responsavel}</div>
                                        <div className="text-xs opacity-90">{dateLabel} · {fmtHour(r.start)} — {fmtHour(r.end)}</div>
                                    </div>
                                    );
                                })}
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
    );
}
