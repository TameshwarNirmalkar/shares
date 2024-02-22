"use client";

import { Button, Card, Col, Divider, Form, GetProp, Image, Input, Row, Space, Upload, UploadFile, UploadProps, message } from "antd";
import { FC, memo, useCallback, useEffect, useState } from "react";

import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import DrawerComponent from "@components/DrawerComponent";
import SubmitButton from "@components/SubmitButton";
import { useAppDispatch, useAppSelector } from "@redux-store/reduxHooks";
import { getUserDetailsAction, updateUsersAction } from "@redux-store/users/action";
import { isLoading, userDetailsState } from "@redux-store/users/memonised-user";
import Meta from "antd/es/card/Meta";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const MyProfile: FC<{}> = memo(() => {
  const { push } = useRouter();
  const { data: session } = useSession() as any;
  const dispatch = useAppDispatch();

  const selectedData = useAppSelector(userDetailsState);
  const loading = useAppSelector(isLoading);

  const [imageUrl, setImageUrl] = useState<string>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (session.user.user.email) {
      dispatch(getUserDetailsAction(session.user.user.email));
    }
  }, [session, dispatch]);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const onBeforeLoad = useCallback((file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    } else if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    } else {
      setFileList([file]);
    }
    return false;
  }, []);

  const onUploadImage = useCallback(async () => {
    const formData = new FormData();
    formData.append("image", fileList[0] as any);
    const res = await fetch(`/api/upload-image`, {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
    if (res.success) {
      await dispatch(updateUsersAction({ ...selectedData, ...form.getFieldsValue(), profile_image: res.data.url }));
    }
  }, [fileList]);

  const onFormFinish = useCallback(
    async (val: any) => {
      await dispatch(updateUsersAction({ ...selectedData, ...val }));
      setIsDrawerOpen(false);
    },
    [session, imageUrl]
  );

  return (
    <>
      <Row gutter={[10, 10]}>
        <Col span={8}>
          <Card cover={<img alt="example" src={session?.user?.user?.image} />}>
            <Meta title={session?.user?.user?.name} />
            <Divider className="my-3" />
            <Space direction="vertical">
              <h2 className="grid grid-cols-1">
                <strong>Email: </strong> <span className="text-slate-500">{selectedData?.email}</span>
              </h2>
              <h2 className="grid grid-cols-1">
                <strong>Phone: </strong> <span className="text-slate-500">{selectedData?.phone}</span>
              </h2>
              <h2 className="grid grid-cols-1">
                <strong>Whatsapp: </strong> <span className="text-slate-500">{selectedData?.whatsapp}</span>
              </h2>
              <h2 className="mb-5 grid grid-cols-1">
                <strong>Address: </strong> <span className="text-slate-500">{selectedData?.address}</span>
              </h2>
            </Space>
            <Button type="primary" block onClick={() => setIsDrawerOpen(true)}>
              Edit Profile
            </Button>
          </Card>
        </Col>
        <Col span={16}>Items</Col>
      </Row>

      <DrawerComponent
        heading="Edit Details"
        isOpen={isDrawerOpen}
        onCloseDrawer={() => {
          setIsDrawerOpen(false);
          // setImageUrl("");
        }}
      >
        <Form form={form} initialValues={{ ...selectedData }} name="addclientForm" layout="vertical" autoComplete="off" onFinish={onFormFinish}>
          <Card className="mb-3 bg-slate-500">
            <Row align={"middle"}>
              <Col span={7}>
                <Upload
                  listType="picture-card"
                  showUploadList={false}
                  action="#"
                  beforeUpload={onBeforeLoad}
                  onPreview={() => false}
                  fileList={fileList}
                  multiple={false}
                >
                  {selectedData?.profile_image ? <Image src={selectedData?.profile_image} width={100} preview={false} /> : uploadButton}
                </Upload>
              </Col>
              <Col>
                <Button type="primary" onClick={onUploadImage} disabled={loading || !imageUrl}>
                  <div className="text-white-800">Change Profile Image</div>
                </Button>
                <div className="pt-1">
                  <sup className="text-slate-200">File size should not greater then 2 mb.</sup>
                </div>
              </Col>
            </Row>
          </Card>

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
    </>
  );
});

export default MyProfile;
