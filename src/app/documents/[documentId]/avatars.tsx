import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    ClientSideSuspense,
    useOthers,
    useSelf
} from "@liveblocks/react/suspense";

const AVATAR_SIZE = 36;

export const Avatars = () => {
  const currentUser = useSelf();
  const others = useOthers();
  
  // 组合当前用户和其他用户
  const allUsers = [
    {
      id: currentUser.id,
      name: currentUser.info.name,
      avatar: currentUser.info.avatar,
    },
    ...others.map((other) => ({
      id: other.id,
      name: other.info.name,
      avatar: other.info.avatar,
    })),
  ];

  return (
    <ClientSideSuspense fallback={null}>
      <AvatarStack users={allUsers} />
    </ClientSideSuspense>
  );
};

type AvatarStackProps = {
  users: Array<{ id: string; name: string; avatar: string }>;
};

const AvatarStack = ({ users }: AvatarStackProps) => {
  if (users.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {users.map((user, index) => (
        <div key={user.id} className="flex items-center gap-2">
          <div
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            className="group flex shrink-0 place-content-center relative"
          >
            <Avatar
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
              className="border-4 border-white rounded-full"
            >
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gray-400">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="opacity-0 group-hover:opacity-100 absolute top-full py-1 px-2 text-white text-sm rounded-lg mt-2.5 z-10 bg-black whitespace-nowrap transition-opacity">
              {user.name}
            </div>
          </div>
          {index < users.length - 1 && (
            <div className="h-6 w-px bg-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
};
