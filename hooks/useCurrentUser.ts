import useSwr from 'swr'
import fetcher from '@/libs/fetcher'

const userCurrentUser = () => {
    const {data, error,isLoading, mutate} = useSwr('/api/current', fetcher)

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default userCurrentUser