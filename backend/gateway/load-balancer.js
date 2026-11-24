// Round robin algorithm
function getNextInstance(service) {

    const available = service.instances.filter(
        instance => instance.alive
    );

    if (!available.length) {
        return null;
    }

    service.currentIndex = ((service.currentIndex ?? 0) + 1) % available.length;

    return available[service.currentIndex];
}

module.exports = { getNextInstance };
