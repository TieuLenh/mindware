for %%i in (3001 3002) do (
    start "Port %%i" cmd /k "set SERVER_ID=%%i & set PORT=%%i & npm run dev"
)