import React, { Component } from 'react';
import Text from 'components/inputs/Text';
import Textarea from 'components/inputs/Textarea';
import Select from 'components/inputs/Select';
import Tags from 'components/inputs/Tags';
import TextEditor from 'components/inputs/TextEditor';
import Dates from 'components/inputs/Dates';
import Phone from 'components/inputs/Phone';
import UploadPhoto from 'components/inputs/UploadPhoto';
import { Radio } from 'components/inputs/RadioList';
import Switch from 'components/inputs/Switch';

class Input extends Component {
  components = {
    text: Text,
    password: Text,
    email: Text,
    url: Text,
    textarea: Textarea,
    editor: TextEditor,
    number: Text,
    date: Dates,
    array: Text,
    select: Select,
    tags: Tags,
    phone: Phone,
    photo: UploadPhoto,
    radio: Radio,
    switch: Switch
  };

  render() {
    const TagName = this.components[this.props.tag || 'text'];
    return <TagName {...this.props} />;
  }
}
export default Input;
