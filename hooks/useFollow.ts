import { useCallback, useMemo } from "react";
import userCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import useUser from "./useUser";
import { toast } from "react-hot-toast";
import axios from "axios";

const useFollow = (userId: string) => {
  const { data: currentUser, mutate: mutateCurrentUser } = userCurrentUser();
  const { mutate: mutateFetchedUser } = useUser(userId);

  const loginModal = useLoginModal();

  const isFollowing = useMemo(() => {
    const list = currentUser?.followingIds || [];

    return list.includes(userId);
  }, [userId, currentUser?.followingIds]);

  const toogleFollow = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      if (isFollowing) {
        console.log(userId);
        request = () => axios.delete("/api/follows", { params: { userId } });
      } else {
        request = () => axios.post("/api/follows", { userId });
      }

      mutateCurrentUser();
      mutateFetchedUser();
      await request();
      toast.success("Succes");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }, [
    currentUser,
    isFollowing,
    userId,
    mutateCurrentUser,
    mutateFetchedUser,
    loginModal,
  ]);

  return {
    isFollowing,
    toogleFollow,
  };
};

export default useFollow;
