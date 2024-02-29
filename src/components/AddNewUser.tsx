"use client";

import { Button, Card, Col, Form, GetProp, Image, Input, Modal, Row, UploadFile, UploadProps, message } from "antd";
import { memo, useCallback, useEffect, useState } from "react";

import { createMyClientsAction, updateMyClientsAction } from "@redux-store/my-clients/action";
import { useAppDispatch } from "@redux-store/reduxHooks";
import { getBase64 } from "@utility/utilsFunction";
import Upload, { RcFile } from "antd/es/upload";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const AddNewUser = memo<{ isNewUser: boolean; selectedData: any; loading: boolean; onModalOpen: (val: boolean) => void; onAfterClose: () => void }>((props) => {
  const { isNewUser, selectedData, loading, onModalOpen, onAfterClose } = props;

  const dispatch = useAppDispatch();
  const [userAddForm] = Form.useForm();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>();

  useEffect(() => {
    userAddForm.setFieldsValue(selectedData);
    return () => {
      setImageUrl(undefined);
      userAddForm.resetFields();
    };
  }, [selectedData]);

  const onBeforeLoad = useCallback((file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    } else if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    } else {
      setFileList([file]);
      getBase64(file, (url) => {
        setImageUrl(url);
      });
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
    // if (res.success) {
    //   await dispatch(updateMyClientsAction({ ...selectedData, ...userAddForm.getFieldsValue(), profile_image: res.data.url }));
    // }
    return res;
  }, [fileList]);

  const onFormFinish = useCallback(async () => {
    try {
      const res = await userAddForm.validateFields();

      if (selectedData) {
        let payload = { ...res };
        if (imageUrl) {
          const img_res = await onUploadImage();
          payload.profile_image = img_res.data.url;
        }
        await dispatch(updateMyClientsAction({ ...selectedData, ...payload }));
      } else {
        let payload = { ...res };
        if (imageUrl) {
          const img_res = await onUploadImage();
          payload.profile_image = img_res.data.url;
        }
        await dispatch(createMyClientsAction({ ...payload }));
      }
      onModalOpen(false);
    } catch (error) {
      console.log("ERROR :: ", error);
    }
  }, [userAddForm, selectedData, fileList, imageUrl]);

  return (
    <Modal
      title={`${selectedData ? "Edit" : "Add"} Client Information.`}
      open={isNewUser}
      okText={selectedData ? "Update" : "Save"}
      onCancel={() => onModalOpen(false)}
      maskClosable={false}
      centered
      okButtonProps={{ style: { padding: "3px 50px" } }}
      onOk={onFormFinish}
      afterClose={onAfterClose}
    >
      {/* initialValues={{ ...selectedData }} */}
      <Form form={userAddForm} name="addEditUserForm" layout="vertical" autoComplete="off">
        <Card bordered={false} className="bg-slate-600 p-0 mb-5">
          <Row align={"middle"} gutter={[20, 10]}>
            <Col>
              <Image
                src={selectedData?.profile_image ?? imageUrl ?? "https://i.ibb.co/Wf7TB9k/png-transparent-head-the-dummy-avatar-man-tie-jacket-user.png"}
                width={100}
                height={100}
                preview={false}
                className="rounded-full border-slate-500 bg-cover bg-center"
              />
            </Col>
            <Col>
              <Upload showUploadList={false} beforeUpload={onBeforeLoad} onPreview={() => false} fileList={fileList} multiple={false}>
                <Button type="primary">
                  <div className="text-white-800">Change Profile Image</div>
                  <div className="pt-2">
                    <sup className="text-slate-400">File size should not greater then 2 mb.</sup>
                  </div>
                </Button>
              </Upload>
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
          name="phone"
          label="Phone"
          rules={[
            { required: true, message: "Required" },
            { pattern: /^[0-9]{10}\/*$/g, message: "Only 10 digits" },
          ]}
        >
          <Input maxLength={10} addonBefore="+91" />
        </Form.Item>

        <Form.Item name="address" label="Address" rules={[{ required: true, message: "Required" }]}>
          <Input.TextArea rows={6} />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default AddNewUser;
