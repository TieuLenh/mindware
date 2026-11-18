// Round robin algorithm
function getNextInstance(service) {

    const available = service.instances.filter(
        instance => instance.alive
    );

    if (available.length === 0) {
        return null;
    }

    const index = service.currentIndex % available.length;

    service.currentIndex++;

    return available[index];
}

module.exports = { getNextInstance };
