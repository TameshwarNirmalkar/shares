import { Form, Input } from "antd";
import dayjs from "dayjs";
import { memo } from "react";

const CalculatorComponent = memo(() => {
  const [calculatorForm] = Form.useForm();
  return (
    <div>
      <Form
        form={calculatorForm}
        layout="vertical"
        onValuesChange={(val, allval) => {
          if (allval.amount && allval.percentage) {
            const interest: string = (allval.amount * (allval.percentage / 100)).toFixed(2);
            calculatorForm.setFieldValue("monthly_interest", interest);
            const perday_amount = (parseInt(interest) / dayjs().daysInMonth()).toFixed(2);
            calculatorForm.setFieldValue("perday_interest", perday_amount);
          } else {
            calculatorForm.setFieldValue("monthly_interest", null);
            calculatorForm.setFieldValue("perday_interest", null);
          }
        }}
      >
        <Form.Item label="Principle Ammount" name={"amount"}>
          <Input addonAfter="₹" />
        </Form.Item>
        <Form.Item label="Percentage %" name={"percentage"}>
          <Input addonAfter="%" />
        </Form.Item>
        <Form.Item label="Monthly Interest" name={"monthly_interest"}>
          <Input addonAfter="₹" readOnly={true} />
        </Form.Item>
        <Form.Item label="Per Day Interest of Current Month" name={"perday_interest"}>
          <Input addonAfter="₹" readOnly={true} />
        </Form.Item>
      </Form>
    </div>
  );
});

export default CalculatorComponent;
