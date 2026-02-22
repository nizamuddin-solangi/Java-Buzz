/* ===========================
   JAVA BUZZ - MAP JS (Leaflet)
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    // Java Buzz Coffee Shop coordinates (New York City example)
    const shopLat = 40.7128;
    const shopLng = -74.0060;

    // Initialize the map
    const map = L.map('map', {
        center: [shopLat, shopLng],
        zoom: 15,
        scrollWheelZoom: false, // Better UX on scrollable pages
        zoomControl: true
    });

    // Custom warm tile layer (CartoDB Voyager - clean, warm look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Custom coffee-themed marker icon
    const coffeeIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
      <div style="
        background: linear-gradient(135deg, #C8A16A 0%, #6F4E37 100%);
        width: 52px;
        height: 52px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 20px rgba(62,31,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid #fff;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 22px;
          display: block;
          margin-top: 2px;
          margin-left: 2px;
        ">☕</span>
      </div>
    `,
        iconSize: [52, 52],
        iconAnchor: [26, 52],
        popupAnchor: [0, -56]
    });

    // Add marker
    const marker = L.marker([shopLat, shopLng], { icon: coffeeIcon }).addTo(map);

    // Info popup
    marker.bindPopup(`
    <div style="
      font-family: 'Inter', sans-serif;
      padding: 8px;
      min-width: 200px;
    ">
      <div style="
        font-family: 'Playfair Display', serif;
        font-size: 1.1rem;
        font-weight: 700;
        color: #3E1F00;
        margin-bottom: 6px;
      ">☕ Java Buzz Coffee</div>
      <div style="font-size: 0.82rem; color: #6F4E37; margin-bottom: 4px;">
        📍 123 Brew Street, Manhattan<br>New York, NY 10001
      </div>
      <div style="font-size: 0.82rem; color: #6F4E37; margin-bottom: 4px;">
        🕐 Mon–Fri: 7AM–9PM<br>
        &nbsp;&nbsp;&nbsp;&nbsp;Sat–Sun: 8AM–10PM
      </div>
      <div style="font-size: 0.82rem; color: #6F4E37;">
        📞 (212) 555-BUZZ
      </div>
      <a href="https://www.google.com/maps/dir/?api=1&destination=${shopLat},${shopLng}"
         target="_blank"
         style="
           display: inline-block;
           margin-top: 10px;
           padding: 6px 14px;
           background: linear-gradient(135deg, #C8A16A, #6F4E37);
           color: #fff;
           border-radius: 20px;
           font-size: 0.78rem;
           font-weight: 600;
           text-decoration: none;
         ">
        Get Directions →
      </a>
    </div>
  `, {
        maxWidth: 250,
        className: 'java-buzz-popup'
    });

    // Open popup on load
    marker.openPopup();

    // Add a subtle circle to highlight the area
    L.circle([shopLat, shopLng], {
        color: '#C8A16A',
        fillColor: '#C8A16A',
        fillOpacity: 0.08,
        weight: 1,
        radius: 300
    }).addTo(map);

    // Add nearby landmark markers for context
    const landmarks = [
        { lat: 40.7138, lng: -74.0040, name: '🅿️ Public Parking', desc: '5 min walk away' },
        { lat: 40.7110, lng: -74.0070, name: '🚇 Subway Station', desc: '3 min walk away' },
        { lat: 40.7150, lng: -74.0080, name: '🏛️ City Library', desc: 'Nearby landmark' }
    ];

    const smallIcon = L.divIcon({
        className: 'landmark-marker',
        html: `<div style="
      background: white;
      border: 2px solid #C8A16A;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    ">📍</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
    });

    landmarks.forEach(lm => {
        L.marker([lm.lat, lm.lng], { icon: smallIcon })
            .bindPopup(`<strong style="font-size:0.85rem;">${lm.name}</strong><br><span style="font-size:0.8rem;color:#6F4E37;">${lm.desc}</span>`)
            .addTo(map);
    });

    // Make map scroll-zoom toggleable on button click
    const scrollBtn = document.getElementById('toggle-scroll-zoom');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            if (map.scrollWheelZoom.enabled()) {
                map.scrollWheelZoom.disable();
                scrollBtn.textContent = 'Enable Scroll Zoom';
            } else {
                map.scrollWheelZoom.enable();
                scrollBtn.textContent = 'Disable Scroll Zoom';
            }
        });
    }
});
