import userCurrentUser from "@/hooks/useCurrentUser";
import useUser from "@/hooks/useUser";
import useEditModal from "@/hooks/useEditModal";
import axios from "axios";
import React, {useCallback, useEffect, useState} from "react";
import { toast } from "react-hot-toast";
import Modal from "../Modal";
const EditModal = () => {
  const { data: currentUser } = userCurrentUser();
  const { mutate: mutateFetchedUser } = useUser(currentUser?.id);

  const editModal = useEditModal();

  const [profileImage, setProfileImage] = useState('');
  const [image, setImage] = useState('')
  const [name, setName] = useState('')

  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
        setProfileImage(currentUser?.profileImage)
        setImage(currentUser?.image)
        setName(currentUser?.name)
        setUsername(currentUser?.username)
        setBio(currentUser?.bio)

  }, [currentUser])

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = useCallback( async() => {
    try {
        setIsLoading(true)

        await axios.patch('/api/edit',{
            name,username,profileImage,image,bio
        }
        )
        mutateFetchedUser()
        toast.success('Updated!')
    } catch (error) {
          toast.error('Something went wrong')
            
    }finally{
        setIsLoading(false)
    }
  }, [bio, name, username,profileImage,image, editModal, mutateFetchedUser])

  return(
    <Modal 
        disabled={isLoading}
        isOpen={editModal.isOpen}
        title="Edit your profile"
        actionLabel="Save"
        onClose={editModal.onClose}
        onSubmit={onSubmit}
     />
  )
};

export default EditModal;
