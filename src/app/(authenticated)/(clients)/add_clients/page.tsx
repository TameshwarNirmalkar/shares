"use client";

import { Alert, Card, Col, Image, Row, Space, Tooltip } from "antd";
import { NextPage } from "next";

import AddNewUser from "@components/AddNewUser";
import SpinnerLoader from "@components/SpinnerLoader";
import UserDetailsComponent from "@components/UserDetailsComponent";
import { faUserEdit, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppDispatch, useAppSelector } from "@redux-store/reduxHooks";
import { getUserDetailsAction } from "@redux-store/users/action";
import { isLoading, userDetailsState } from "@redux-store/users/memonised-user";
import { useSession } from "next-auth/react";
import { Fragment, useCallback, useEffect, useState } from "react";

const AddClientsPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const userList = useAppSelector(userDetailsState);
  const loading = useAppSelector(isLoading);

  const { data: session }: any = useSession();
  const [errormsg, setErrorMsg] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  useEffect(() => {
    if (session?.user?.accessToken) {
      dispatch(getUserDetailsAction(session?.user?.user?.email));
    }
  }, [dispatch, session?.user?.accessToken]);

  const onEditHandler = useCallback(async (row: any) => {
    // await dispatch(getUserDetailsAction(row.email));
    setIsDrawerOpen(true);
  }, []);

  // const onDelete = useCallback(async (row: any) => {
  //   Modal.confirm({
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

  const onAddNewUser = useCallback(() => {
    setIsNewUser(true);
  }, []);

  return (
    <div>
      {errormsg && <Alert message="Unauthorised" description="Please login again." type="error" />}
      <Row gutter={[10, 10]}>
        {userList &&
          Array(userList)?.map((el: any) => (
            <Fragment key={el?._id}>
              <Col span={8}>
                <Card
                  bordered={false}
                  hoverable
                  cover={
                    <Image
                      preview={false}
                      src={`${el?.profile_image}`}
                      fallback="https://i.ibb.co/bXYfNhs/png-transparent-head-the-dummy-avatar-man-tie-jacket-user.png"
                      height={200}
                    />
                  }
                >
                  <Row align={"middle"} justify={"space-between"}>
                    <Col>
                      <h1 className="text-3xl">{el?.full_name}</h1>
                      <h2 className="text-slate-400">{session?.user?.user?.id === el?._id ? el?.email : ""}</h2>
                    </Col>
                    {session.user.user.id === el?._id && (
                      <Col>
                        <Space>
                          <Tooltip placement="top" title={"Update your details."}>
                            <span className="text-white cursor-pointer rounded-full bg-yellow-400 p-2" onClick={() => onEditHandler(el)}>
                              <FontAwesomeIcon icon={faUserEdit} color="#78350f" />
                            </span>
                          </Tooltip>
                          <Tooltip placement="top" title={"Add new user in you account."}>
                            <span className="text-white cursor-pointer rounded-full bg-lime-400 p-2" onClick={onAddNewUser}>
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

      <UserDetailsComponent drawerHeading="Edit Details" isDrawerOpen={isDrawerOpen} onDrawerOpen={(val) => setIsDrawerOpen(val)} />

      <AddNewUser loading={loading} isNewUser={isNewUser} selectedData={""} onModalOpen={(val: boolean) => setIsNewUser(val)} />

      <SpinnerLoader loading={loading} />
    </div>
  );
};

export default AddClientsPage;
