interface User {
  id: string;
  name: string;
  room: string;
}

const users: User[] = [];

// Join user to chat
export function userJoin(id: string, name: string, room: string): User {
  const user = {id, name, room};

  users.push(user);
  return user;
}

// Get current user
export function getCurrentUser(id: string): User | undefined {
  const user = users.find(user => user.id === id);

  if (user === undefined) {
    console.log(`no user found with id ${id}`);
  }

  return user;
}
