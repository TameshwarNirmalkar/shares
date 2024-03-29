"use client";

import { Alert, App, Card, Col, Divider, Image, Row, Space, Tooltip } from "antd";

import AddNewUser from "@components/AddNewUser";
import SpinnerLoader from "@components/SpinnerLoader";
import UserDetailsComponent from "@components/UserDetailsComponent";
import { faTrash, faUserEdit, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { selectAllMyClients, selectMyClientsById } from "@redux-store/my-clients";
import { deleteMyClientAction, getMyClientsListAction } from "@redux-store/my-clients/action";
import { isLoading } from "@redux-store/my-clients/memonised-selector";
import { useAppDispatch, useAppSelector } from "@redux-store/reduxHooks";
import { getUserDetailsAction } from "@redux-store/users/action";
import { userDetailsState } from "@redux-store/users/memonised-user";
import { useSession } from "next-auth/react";
import { FC, Fragment, memo, useCallback, useEffect, useState } from "react";

const AddClientsPage: FC = () => {
  const dispatch = useAppDispatch();
  const userList = useAppSelector(userDetailsState);
  const loading = useAppSelector(isLoading);
  const clientList = useAppSelector(selectAllMyClients);

  const { data: session }: any = useSession();
  const [errormsg, setErrorMsg] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<any>({});

  const selectedClient = useAppSelector((state) => selectMyClientsById(state, selectedData._id));

  const { modal } = App.useApp();

  useEffect(() => {
    if (!userList) {
      dispatch(getUserDetailsAction(""));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!clientList.length) {
      dispatch(getMyClientsListAction(""));
    }
  }, [dispatch]);

  const onEditHandler = useCallback(async (row: any) => {
    // await dispatch(getUserDetailsAction(row.email));
    setIsDrawerOpen(true);
  }, []);

  // const onDelete = useCallback(async (row: any) => {
  //   modal.confirm({
  //     okText: "Yes",
  //     cancelText: "No",
  //     centered: true,
  //     title: "Delete User",
  //     content: (
  //       <div>
  //         <span>Are you sure!!! want to delete the user?</span>
  //       </div>
  //     ),
  //     onOk: async () => {
  //       const response: any = await fetch(`/api/user`, {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${session?.user?.accessToken}`,
  //         },
  //         body: JSON.stringify({ id: row._id }),
  //       }).then((res) => res.json());
  //     },
  //   });
  // }, []);

  const onDeleteClient = useCallback(
    async (row: any) => {
      modal.confirm({
        okText: "Yes",
        cancelText: "No",
        centered: true,
        title: "Delete User",
        okButtonProps: { style: { padding: "4px 50px" } },
        cancelButtonProps: { style: { padding: "4px 50px" } },
        content: (
          <div>
            <span>Are you sure!!! want to delete the user?</span>
          </div>
        ),
        onOk: async () => {
          dispatch(deleteMyClientAction(row));
        },
      });
    },
    [dispatch]
  );

  const onAddNewUser = useCallback(() => {
    setIsNewUser(true);
  }, []);

  const onEditUser = useCallback((item: any) => {
    setSelectedData(item);
    setIsNewUser(true);
  }, []);

  return (
    <div>
      {errormsg && <Alert message="Unauthorised" description="Please login again." type="error" />}
      <Row gutter={[10, 10]}>
        {userList &&
          Array(userList)?.map((el: any) => (
            <Fragment key={el?._id}>
              <Col span={4}>
                <Card
                  className="p-0"
                  bordered={false}
                  hoverable
                  cover={
                    <Image
                      preview={false}
                      src={`${el?.profile_image}`}
                      fallback="https://i.ibb.co/Wf7TB9k/png-transparent-head-the-dummy-avatar-man-tie-jacket-user.png"
                      // height={200}
                    />
                  }
                >
                  <Row align={"middle"} justify={"space-between"}>
                    <Col span={20}>
                      <h1 className="text-1xl">{el?.full_name}</h1>
                      {/* <h2 className="text-slate-400">{session?.user?.user?.id === el?._id ? el?.email : ""}</h2> */}
                    </Col>
                    {session.user.user.id === el?._id && (
                      <Col span={2}>
                        <Space direction="vertical">
                          <Tooltip placement="top" title={"Update your details."}>
                            <span className="text-white cursor-pointer rounded-full bg-yellow-400 p-1" onClick={() => onEditHandler(el)}>
                              <FontAwesomeIcon icon={faUserEdit} color="#78350f" />
                            </span>
                          </Tooltip>
                          <Tooltip placement="top" title={"Add new user in you account."}>
                            <span className="text-white cursor-pointer rounded-full bg-lime-400 p-1" onClick={onAddNewUser}>
                              <FontAwesomeIcon icon={faUserPlus} color="#3f6212" />
                            </span>
                          </Tooltip>
                        </Space>
                      </Col>
                    )}
                  </Row>
                </Card>
              </Col>
            </Fragment>
          ))}
      </Row>

      <Divider orientation="left">My Clients</Divider>

      <Row gutter={[20, 10]}>
        {clientList.map((el: any) => (
          <Fragment key={el._id}>
            <Col span={4}>
              <Card
                size="small"
                bordered={false}
                hoverable
                cover={
                  <Image
                    preview={false}
                    src={`${el?.profile_image ?? "https://i.ibb.co/Wf7TB9k/png-transparent-head-the-dummy-avatar-man-tie-jacket-user.png"}`}
                    // height={200}
                  />
                }
              >
                <Row align={"middle"} justify={"space-between"}>
                  <Col span={20}>
                    <h1 className="text-1xl">{el?.full_name}</h1>
                    {/* <h2 className="text-slate-400">{el.phone}</h2> */}
                  </Col>
                  <Col span={2}>
                    <Space direction="vertical">
                      <span className="text-white cursor-pointer rounded-full bg-yellow-400 p-1" onClick={() => onEditUser(el)}>
                        <FontAwesomeIcon icon={faUserEdit} color="#78350f" />
                      </span>
                      <span className="text-white cursor-pointer rounded-full bg-red-600 p-1" onClick={() => onDeleteClient(el)}>
                        <FontAwesomeIcon icon={faTrash} color="#ffffff" />
                      </span>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Fragment>
        ))}
      </Row>

      <UserDetailsComponent drawerHeading="Edit Details" isDrawerOpen={isDrawerOpen} onDrawerOpen={(val) => setIsDrawerOpen(val)} />

      <AddNewUser
        loading={loading}
        isNewUser={isNewUser}
        selectedData={selectedClient}
        onModalOpen={(val: boolean) => setIsNewUser(val)}
        onAfterClose={() => {
          setSelectedData({});
        }}
      />

      <SpinnerLoader loading={loading} />
    </div>
  );
};

export default memo(AddClientsPage);
