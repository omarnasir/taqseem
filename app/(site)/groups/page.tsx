"use client";
import { Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import GroupList from "./_components/list";
import AddGroup from "./_components/add-group";
import { getAllGroupsByUserId } from "@/app/(site)/groups/_lib/user-service";

import { type GroupData } from "@/app/_types/model/groups";
import Loading from "@/app/(site)/loading";

export default function GroupsPage() {
  const { data: sessionData } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [groups, setGroups] = useState<GroupData[]>([]);

  useEffect(() => {
    if (sessionData) {
      const fetchGroups = async () => {
        await getAllGroupsByUserId(sessionData.user.id).then((res) => {
          setGroups(res.data);
          setLoading(false);
        });
      };
      fetchGroups();
    }
  }, [sessionData]);

  return loading ? (
    <Loading />
  ) : (
    <Flex direction={"column"} w="inherit">
      <GroupList {...{ groups: groups, setGroups: setGroups }} />
      <AddGroup {...{ groups: groups, setGroups: setGroups }} />
    </Flex>
  );
}
