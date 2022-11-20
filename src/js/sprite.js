let svgFiles = [];

function importAll(r) {
    r.keys().forEach((s, i) => svgFiles[i] = r(s));
}

importAll(require.context('../img/sprite/', true, /\.svg$/));