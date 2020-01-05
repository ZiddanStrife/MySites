rd production /q /s

xcopy "V1\*" "production\V1" /s /i
xcopy "app\*" "production\app" /s /i
xcopy "src\*" "production\src" /s /i
xcopy "dist\*" "production" /s /i