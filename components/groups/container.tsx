import {
  Box, Heading,
} from '@chakra-ui/react'
import GroupAccordian from "@/components/groups/details";
import { type GroupData } from "@/types/model/groups";

export default function GroupContainer({ groups }:
  { groups: GroupData[] }) {
  return (
    <Box mt={4} borderRadius={8}
      borderColor={'gray.700'}
      borderWidth={1}>
      {!!groups &&
        groups.map((group) => (
          <GroupAccordian {...{ group }} key={group.id} />
        ))}
    </Box>
  )
}