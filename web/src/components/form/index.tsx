import Item, { ItemProps } from "./Item";
import Input, { InputProps } from "./Input";

type CompoundedComponent = {
  Item: React.FC<ItemProps>;
  Input: React.FC<InputProps>;
};

const Form = {} as CompoundedComponent;

Form.Item = Item;
Form.Input = Input;

export default Form;
