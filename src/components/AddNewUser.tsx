"use client";

import { Button, Col, Divider, Form, GetProp, Image, Input, Modal, Row, Upload, UploadFile, UploadProps, message } from "antd";
import { memo, useCallback, useState } from "react";

import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const AddNewUser = memo<{ isNewUser: boolean; selectedData: any; loading: boolean; onModalOpen: (val: boolean) => void }>((props) => {
  const { isNewUser, selectedData, loading, onModalOpen } = props;
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

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
    }
  }, [fileList]);

  const onFormFinish = useCallback(async () => {
    try {
      const res = await form.validateFields();
      console.log("Res: ", res);
    } catch (error) {}
  }, [form]);

  return (
    <Modal
      title="Add User"
      open={isNewUser}
      okText="Save"
      onCancel={() => onModalOpen(false)}
      maskClosable={false}
      centered
      okButtonProps={{ style: { padding: "3px 50px" } }}
      onOk={onFormFinish}
    >
      <Form form={form} initialValues={{ ...selectedData }} name="addclientForm" layout="vertical" autoComplete="off">
        <Row align={"middle"}>
          <Col span={7}>
            <Upload
              listType="picture-circle"
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
            <Button type="primary" onClick={onUploadImage} disabled={loading || !fileList.length}>
              <div className="text-white-800">Change Profile Image</div>
            </Button>
            <div className="pt-1">
              <sup className="text-slate-600">File size should not greater then 2 mb.</sup>
            </div>
          </Col>
        </Row>
        <Divider className="my-2" />
        <Form.Item name="_id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="full_name" label="Full Name" rules={[{ required: true, message: "Required" }]}>
          <Input />
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

        <Form.Item name="address" label="Address" rules={[{ required: true, message: "Required" }]}>
          <Input.TextArea rows={6} />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default AddNewUser;
