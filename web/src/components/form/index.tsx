import Item, { ItemProps } from "./Item";
import Input, { InputProps } from "./Input";
import Select, { SelectProps } from "./Select";

type CompoundedComponent = {
  Item: React.FC<ItemProps>;
  Input: React.FC<InputProps>;
  Select: React.FC<SelectProps>;
};

const Form = {} as CompoundedComponent;

Form.Item = Item;
Form.Input = Input;
Form.Select = Select;

export default Form;
