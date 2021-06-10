import { Box, Button, Spinner, Text } from "@chakra-ui/react";
import { useInfiniteQuery, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import PostCard from "../../components/PostCard";
import { IPost } from "../../Types/post";
import get from "../../utils/get";
import flattendeep from "lodash.flattendeep";
interface IError {
  message: string;
}
const fetchPage = async (
  pageParam: number,
  queryKey: string,
  limit: number
) => {
  return await get(
    `api/tribes/${queryKey}/posts/?pageParam=${pageParam}&limit=${limit}`
  );
};
const Postlist = () => {
  const { tribeId } = useParams<{ tribeId: string }>();
  const limit = 10;
  const {
    status,
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<IPost[], IError>(
    ["PostList", tribeId],
    ({ pageParam = 0, queryKey }) =>
      fetchPage(pageParam, queryKey[1] as string, limit),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === limit) return allPages.length;
        return false;
      },
    }
  );
  const postList = flattendeep(data?.pages);
  return (
    <Box>
      {status === "error" ? (
        <Text>{error?.message}</Text>
      ) : status === "loading" ? (
        <Spinner />
      ) : status === "success" ? (
        postList.length > 0 ? (
          postList.map((post) => <PostCard {...post} />)
        ) : (
          <Text>No post to display.</Text>
        )
      ) : (
        ""
      )}
      {postList.length > 0 && (
        <Button
          color="teal"
          variant="solid"
          disabled={!hasNextPage}
          onClick={() => fetchNextPage()}
        >
          Load more post..
        </Button>
      )}
    </Box>
  );
};

export default Postlist;
