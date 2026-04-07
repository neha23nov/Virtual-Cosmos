import { PROXIMITY_RADIUS } from './constants';

// Calculate distance between two players
export const getDistance = (user1, user2) => {
  const dx = user1.x - user2.x;
  const dy = user1.y - user2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Returns array of user IDs that are within proximity of the current user
export const getNearbyUsers = (myPos, users, myId) => {
  const nearby = [];

  Object.values(users).forEach((user) => {
    if (user.id === myId) return;

    const dist = getDistance(myPos, { x: user.x, y: user.y });

    if (dist < PROXIMITY_RADIUS * 2) {
      nearby.push({
        ...user,
        distance: Math.round(dist),
      });
    }
  });

  return nearby;
};