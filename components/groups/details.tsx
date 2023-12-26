import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
}
  from "@chakra-ui/react";
import { getUsersByGroupId } from "@/client/services/membershipService";
import { type UserMembershipsByGroup } from '@/types/model/memberships';


export default function GroupAccordian({ id, name }:
  { id: string, name: string }) {
  const [users, setUsers] = useState<UserMembershipsByGroup>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsersByGroupId(id);
      setUsers(res.data.users!);
    }
    fetchUsers();
  }, [id]);

  return (
   
    <Accordion allowToggle borderWidth={0}>
      <AccordionItem border={"none"}>
        <h2>
          <AccordionButton
            textAlign={'left'}
            justifyContent={'space-between'}
            key={id}>
            {name}
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} borderBottomWidth={1}>
          {users.length > 0 ? users.map((user) => (
            <div key={user.id}>{user.name}</div>
          )) : <p>No users in this group</p>}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}