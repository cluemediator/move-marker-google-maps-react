import React, { useEffect, useRef, useState } from 'react';

const GMap = () => {
  const googleMapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const googleMap = initGoogleMap();
    setMap(googleMap);
  }, []);

  useEffect(() => {
    if (!map) return;

    var haight = new window.google.maps.LatLng(37.7699298, -122.4469157);
    var oceanBeach = new window.google.maps.LatLng(37.7683909618184, -122.51089453697205);

    // draw start marker
    new window.google.maps.Marker({
      position: haight,
      map
    });
    // draw end marker
    new window.google.maps.Marker({
      position: oceanBeach,
      map
    });

    // draw line between two points
    new window.google.maps.Polyline({
      path: [haight, oceanBeach],
      map
    });

    // draw marker to move from one point to another
    const marker = new window.google.maps.Marker({
      position: haight,
      map,
      icon: {
        url: '/marker-icon.png',
        scaledSize: new window.google.maps.Size(50, 50),
      }
    });

    // move marker from one point to another
    animatedMove(marker, haight, oceanBeach, 3);
  }, [map])

  const initGoogleMap = () => {
    return new window.google.maps.Map(googleMapRef.current, {
      center: new window.google.maps.LatLng(37.7699298, -122.4469157),
      zoom: 12
    });
  }

  const animatedMove = async (marker, moveFrom, moveTo, t, delta = 100) => {
    return new Promise(resolve => {
      const deltalat = (moveTo.lat() - moveFrom.lat()) / delta;
      const deltalng = (moveTo.lng() - moveFrom.lng()) / delta;
      let delay = 10 * t, count = 0;
      for (let i = 0; i < delta; i++) {
        (function (ind) {
          setTimeout(
            function () {
              let lat = marker.position.lat();
              let lng = marker.position.lng();
              lat += deltalat;
              lng += deltalng;
              marker.setPosition(new window.google.maps.LatLng(lat, lng));

              count++
              if (count === delta) {
                resolve(marker);
              }
            }, delay * ind
          );
        })(i)
      }
    })
  }

  return <div
    ref={googleMapRef}
    style={{ width: 600, height: 300 }}
  />
}

export default GMap;