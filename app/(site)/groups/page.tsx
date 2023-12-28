'use client'
import { Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import GroupList from "@/components/groups/list";
import AddGroup from "@/components/groups/add-group";
import {
  getAllGroupsByUserId
} from "@/client/services/group-service";

import { type GroupData} from "@/types/model/groups";
import Loading from "../loading";

async function getAllGroupsData(id: string)
  : Promise<GroupData[]> {
  const res = await getAllGroupsByUserId(id)
  if (res.success) {
    return res.data!;
  }
  else return [];
}

export default function GroupsPage() {
  const { data: sessionData } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [groups, setGroups] = useState<GroupData[]>([]);

  useEffect(() => {
    if (sessionData) {
      const fetchGroups = async () => {
        await getAllGroupsData(sessionData.user.id).then((data) => {
          setGroups(data!);
          setLoading(false);
        });
      }
      fetchGroups();
    }
  }, [sessionData]);


  return (
    loading ? <Loading /> :
      <Flex direction={'column'} w='inherit'>
        <GroupList {...{ groups: groups, setGroups: setGroups }} />
        <AddGroup {...{ groups: groups, setGroups: setGroups }} />
      </Flex>
  );
}