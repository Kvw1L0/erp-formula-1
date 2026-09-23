# Catálogo de Assets Visuales: Monoplazas F1

Esta carpeta (`client/public/cars/`) está destinada para alojar las imágenes personalizadas de los autos para las 6 escuderías del Gran Premio.

---

## 🏎️ Nombres de Archivo Requeridos

Para reemplazar los vehículos en la pista con diseños propios, sube los archivos directamente a esta carpeta con estos nombres exactos:

| Archivo | Escudería | Color Oficial de Respaldo |
| :--- | :--- | :--- |
| `car-1.png` | **Escudería 1** | Azul Red Bull / Williams (`#3671C6`) |
| `car-2.png` | **Escudería 2** | Rojo Ferrari (`#E80020`) |
| `car-3.png` | **Escudería 3** | Turquesa Mercedes / Petronas (`#27F4D2`) |
| `car-4.png` | **Escudería 4** | Naranja McLaren (`#FF8000`) |
| `car-5.png` | **Escudería 5** | Verde Aston Martin (`#229971`) |
| `car-6.png` | **Escudería 6** | Cian / Azul Alpine (`#0093CC`) |

---

## 📐 Especificaciones Recomendadas

1. **Formato:** PNG con transparencia (Canal Alfa / Fondo Transparente).
2. **Orientación:** Vista lateral estricta (perfil) del monoplaza mirando hacia la **DERECHA** (sentido de avance en la pista).
3. **Resolución:**
   - Óptima: `320 x 96 px` (Proporción aproximada `3.3:1`).
   - Mínima: `200 x 60 px`.
   - Máxima recomendada: `640 x 192 px` (para evitar consumo excesivo de memoria en tablets).
4. **Peso por archivo:** Menor a `300 KB` para garantizar renderizado fluido a 60 FPS en pantalla gigante y tablets.

---

## 🛡️ Fallback Automático

Si no subes ningún archivo o si alguna imagen falla al cargarse, **el sistema no se rompe**:
- El componente `F1CarSvg.jsx` renderiza de manera nativa e instantánea un **monoplaza vectorial SVG oficial** con el color de la escudería, alerones de fibra de carbono, halo de seguridad, aleta de tiburón y el número de monoplaza.

---

## 🎬 Videos Cinemáticos (`client/public/videos/`)

Para los videos de carrera en pantalla gigante:
- `video-1-start.mp4`: Video de largada / semáforo (10s aprox).
- `video-2-battle.mp4`: Video de duelo rueda a rueda / adelantamiento (10s aprox).
- `sector-01-battle.mp4` a `sector-06-battle.mp4`: Videos específicos por sector/desafío.
- **Códec:** MP4 (Video: H.264 / Audio: AAC).
- **Resolución:** 1920x1080 (Full HD) o 1280x720 (HD).
