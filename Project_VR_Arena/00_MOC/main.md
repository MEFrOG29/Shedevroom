```dataview
TABLE WITHOUT ID type as "Тип",
category as "Категория",
price as "Цена",
lounge_hours as "Часы лаунжа",
vr_hours as "Часы vr",
choice(isWeekend, "[X]", "[-]") as "Пятница/Выходной"
FROM "00_MOC/01_Tarifs"
```

