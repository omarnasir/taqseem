import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
}
  from "@chakra-ui/react";
import { getUsersByGroupId } from "@/client/services/membershipService";
import { type UserMembershipsByGroup } from '@/types/model/memberships';


export default function GroupAccordian(props: any) {
  const [users, setUsers] = useState<UserMembershipsByGroup>([]);
  const { group } = props;

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsersByGroupId(group.id);
      setUsers(res.data.users!);
    }
    fetchUsers();
  }, [group.id]);

  return (
    <Accordion allowToggle borderWidth={0}>
      <AccordionItem border={"none"}>
        <h2>
          <AccordionButton
            textAlign={'left'}
            justifyContent={'space-between'}
            key={group.id}>
            {group.name}
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          {users.length > 0 ? users.map((user) => (
              <div key={user.id}>{user.name}</div>
            )) : <p>No users in this group</p>}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}