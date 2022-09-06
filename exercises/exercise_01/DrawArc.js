function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    var ctx = canvas.getContext('2d');
    void ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(223, 159, 191, 1.0)';
    ctx.fill();
}