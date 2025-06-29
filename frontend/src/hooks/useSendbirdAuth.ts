// import { useEffect } from "react";
// import { sb } from "../lib/sendbirdClient";
// import { useUser } from "@clerk/clerk-react";

// export const useSendbirdAuth = () => {
//   const { user } = useUser();

//   useEffect(() => {
//     if (!user) return;

//     const userId = user.id;
//     const nickname = user.firstName || "Anonymous";
//     const profileUrl = user.imageUrl;

//     sb.connect(userId, (connectedUser, error) => {
//       if (error) {
//         console.error("Sendbird connect error", error);
//         return;
//       }

//       // Optional: update user profile
//       sb.updateCurrentUserInfo(nickname, profileUrl, (res, err) => {
//         if (err) console.error("Profile update failed", err);
//       });

//       console.log("✅ Connected to Sendbird:", connectedUser?.nickname);
//     });
//   }, [user]);
// };


import { useEffect } from "react";
import { sb } from "../lib/sendbirdClient";
import { useUser } from "@clerk/clerk-react";

export const useSendbirdAuth = () => {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const userId = user.id;
    const nickname = user.firstName || "Anonymous";
    const profileUrl = user.imageUrl;

    sb.connect(userId, (connectedUser, error) => {
      if (error) {
        console.error("Sendbird connect error", error);
        return;
      }

      // Optional: update user profile
      sb.updateCurrentUserInfo(nickname, profileUrl, (res, err) => {
        if (err) console.error("Profile update failed", err);
      });

      console.log("✅ Connected to Sendbird:", connectedUser?.nickname);
      
      // Mark connection as ready
      (sb as any)._isConnected = true;
    });
  }, [user]);
};

