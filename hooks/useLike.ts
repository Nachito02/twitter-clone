import { useCallback, useMemo } from "react";
import userCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import usePost from "./usePost";
import usePosts from "./usePosts";
import { toast } from "react-hot-toast";
import axios from "axios";

const useLike = ({ postId, userId }: { postId: string; userId?: string }) => {
  const { data: currentUser } = userCurrentUser();

  const { data: fetchedPost, mutate: mutateFetchedPost } = usePost(postId);

  const { mutate: mutateFetchedPosts } = usePosts(userId);

  const loginModal = useLoginModal();

  const hasLike = useMemo(() => {
    const list = fetchedPost?.likeIds || [];

    return list.includes(currentUser?.id);
  }, [currentUser?.id, fetchedPost?.likeIds]);

  const toogleLike = useCallback(async () => {
    if (!currentUser) return loginModal.onOpen();

    try {
      let request;

      if (hasLike) {
        request = () => axios.delete("/api/like", { params: { postId } });
      } else {
        request = () => axios.post("/api/like", { postId });
      }

    await request()
      mutateFetchedPost()
      mutateFetchedPosts()

      toast.success('Sucess')
    } catch (error) {
      toast.error("Something went wrong");
    }


  }, [currentUser, hasLike, postId, fetchedPost, mutateFetchedPost, mutateFetchedPosts, loginModal]);


  return {
    hasLike,
    toogleLike
  }
};

export default useLike