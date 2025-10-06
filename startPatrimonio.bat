@echo off
echo Iniciando o projeto...

:: Abre o backend em uma nova janela
cd /d "C:\Users\pcmec\Documents\GitHub\SitePatrimonioEducere"
start cmd /k "npm run dev"

echo Servidores iniciados.
pause
