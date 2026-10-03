# נטילת ידיים – סרטון אנימציה לילדים (Remotion)

## צפייה בתצוגה מקדימה
```bash
cd netilat-yadayim
npm i
npx remotion studio
```
הדפדפן ייפתח בכתובת http://localhost:3000. בצד שמאל בוחרים את `NetilatYadayim`,
לוחצים על כפתור ה-Play (או מקש רווח), ואפשר לגרור את פס הזמן לכל רגע בסרטון.

## רינדור ל-MP4
```bash
npx remotion render NetilatYadayim out/netilat-yadayim.mp4
```

## מבנה הקוד
- `src/Root.tsx` – הגדרת הסרטון (1920x1080, 30fps, 40 שניות)
- `src/Video.tsx` – הקובץ הראשי: הסצנות לפי הסדר עם מעברי fade
- `src/timing.ts` – אורך כל סצנה
- `src/lines.ts` – המשפטים שהילד אומר, התזמון שלהם, ומקום לקובצי קול
- `src/components/Kid.tsx` – הדמות (ראש, גוף, ידיים, פה, כיפה)
- `src/components/` – נטלה, מים, כתוביות, חדר שינה, חדר אמבטיה
- `src/scenes/` – קובץ לכל סצנה (1–6)

## הוספת קול
1. שימו קובץ MP3 לכל משפט בתיקייה `public/audio/` (למשל `kippah.mp3`, `bracha.mp3`, `goodbye.mp3`).
2. ב-`src/lines.ts` שנו `audio: null` ל-`audio: "audio/kippah.mp3"` וכו'.
3. אם ההקלטה ארוכה או קצרה יותר, עדכנו את `durationInFrames` (30 = שנייה אחת).
