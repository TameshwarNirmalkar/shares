import { Button, Form, FormInstance } from "antd";
import React, { FC, memo } from "react";

const SubmitButton: FC<{ form: FormInstance; isblock: boolean; buttonText?: string }> = (props) => {
  const { form, isblock = false, buttonText = "Submit" } = props;
  const [submittable, setSubmittable] = React.useState(false);

  // Watch all values
  const values = Form.useWatch([], form);

  React.useEffect(() => {
    console.log("isblock ", isblock);

    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
  }, [values]);

  return (
    <Button type="primary" htmlType="submit" disabled={!submittable} block={isblock}>
      {buttonText}
    </Button>
  );
};

export default memo(SubmitButton);
