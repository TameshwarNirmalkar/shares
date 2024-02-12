"use client";

import SubmitButton from "@/components/SubmitButton";
import { Alert, Button, Card, Col, Divider, Form, Image, Input, Modal, Row, Space, Upload, message } from "antd";
import { NextPage } from "next";
import { FaUserTie } from "react-icons/fa6";

import DrawerComponent from "@/components/DrawerComponent";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadProps } from "antd";
import Meta from "antd/es/card/Meta";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { LuFileEdit } from "react-icons/lu";
import { MdDelete } from "react-icons/md";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const AddClientsPage: NextPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const { data: session }: any = useSession();
  const [userList, setUserList] = useState<any[]>([]);
  const [errormsg, setErrorMsg] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [apiCallState, setApiCallState] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [modal, contextHolder] = Modal.useModal();

  const getUserList = useCallback(async () => {
    try {
      const res = await fetch("/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }).then((res) => res.json());
      if (res.code) {
        setErrorMsg(res.message);
      } else {
        setErrorMsg("");
        setUserList(res.userList);
      }
    } catch (error) {
      console.log("Error ====== ", error);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.accessToken) {
      getUserList();
    }
  }, [session?.user?.accessToken, apiCallState]);

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  console.log("userList ", userList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  useEffect(() => {
    form.resetFields();
  }, [form, selectedRow]);

  const onFormFinish = useCallback(
    async (val: any) => {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...selectedRow, ...val }),
      }).then((res) => res.json());
      if (res.success) {
        message.success(res.message);
        setApiCallState((prev) => !prev);
        setIsDrawerOpen(false);
      } else {
        message.error(res.message);
      }
    },
    [session]
  );

  const onEditHandler = useCallback(async (row: any) => {
    setIsDrawerOpen(true);
    setSelectedRow(row);
  }, []);

  const onDelete = useCallback(async (row: any) => {
    Modal.confirm({
      okText: "Yes",
      cancelText: "No",
      centered: true,
      title: "Delete User",
      content: (
        <div>
          <span>Are you sure!!! want to delete the user?</span>
        </div>
      ),
      onOk: async () => {
        const response: any = await fetch(`/api/user`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify({ id: row._id }),
        }).then((res) => res.json());
        setApiCallState((prev) => !prev);
      },
    });
  }, []);

  return (
    <div>
      {errormsg && <Alert message="Unauthorised" description="Please login again." type="error" />}
      <Row gutter={[10, 10]}>
        {userList?.map((el) => (
          <Col span={8} key={el._id}>
            <Card
              bordered={true}
              hoverable
              cover={
                <Image
                  preview={false}
                  src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
                  fallback="data:image/png;base64,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"
                />
              }
            >
              <Row justify={"space-between"}>
                <Col>
                  <Meta title={el.full_name} description={el.email} />
                </Col>
                {session.user.user.id === el._id && (
                  <Col>
                    <Space>
                      <LuFileEdit fontSize={20} className="text-blue-400 cursor-pointer" onClick={() => onEditHandler(el)} />
                      <MdDelete fontSize={20} className="text-red-500 cursor-pointer" onClick={() => onDelete(el)} />
                    </Space>
                  </Col>
                )}
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      <DrawerComponent
        heading="Add/Etid User"
        isOpen={isDrawerOpen}
        onCloseDrawer={() => {
          setIsDrawerOpen(false);
        }}
      >
        <Form form={form} initialValues={{ ...selectedRow }} name="addclientForm" layout="vertical" autoComplete="off" onFinish={onFormFinish}>
          <Form.Item name="_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="full_name" label="Full Name" rules={[{ required: true, message: "Required" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Required" },
              { type: "email", message: "Invalid email." },
            ]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Required" },
              { pattern: /^[0-9]{10}\/*$/g, message: "Only 10 digits" },
            ]}
          >
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item
            name="whatsapp"
            label="Whatsapp Number"
            rules={[
              { required: true, message: "Required" },
              { pattern: /^[0-9]{10}\/*$/g, message: "Only 10 digits" },
            ]}
          >
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true, message: "Required" }]}>
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item>
            <SubmitButton form={form} isblock={true} buttonText="Update User Details" />
            <Divider>OR</Divider>
            <Button htmlType="reset" block onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </DrawerComponent>

      <div className="hidden">
        <h1>Add Clients Page</h1>
        <Row justify={"space-between"}>
          <Col span={12}></Col>
          <Col span={10}>
            <figure className="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800">
              <span className="md:rounded-none rounded-full mx-auto bg-white pt-8">
                <Upload
                  name="avatar"
                  listType="picture-circle"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://run.mocky.io/v3/3ac666c4-0dac-482e-918b-9045f887f04c"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? <FaUserTie className="w-24 h-24 md:w-48 md:h-auto" /> : uploadButton}
                </Upload>
              </span>
              <div className="pt-6 md:p-8 text-center md:text-left space-y-4">
                <blockquote>
                  <p className="text-lg font-medium text-white">
                    “Tailwind CSS is the only framework that I've seen scale on large teams. It’s easy to customize, adapts to any design, and the build size is
                    tiny.”
                  </p>
                </blockquote>
                <figcaption className="font-medium">
                  <div className="text-sky-500 dark:text-sky-400">Sarah Dayan</div>
                  <div className="text-slate-700 dark:text-slate-500">email@abc.com</div>
                </figcaption>
              </div>
            </figure>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AddClientsPage;
