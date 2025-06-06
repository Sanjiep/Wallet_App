const avatarList = [
    require('../assets/images/avatar1.png'),
    require('../assets/images/avatar2.png'),
    require('../assets/images/avatar3.png'),
    require('../assets/images/avatar4.png'),
    require('../assets/images/avatar5.png'),
];

// Assign avatar based on a hash of userId (consistent and unique)
export function getAvatarForUser(userId) {
    if (!userId) return avatarList[0]; // fallback
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % avatarList.length;
    return avatarList[index];
}