export const erroren = {
  en: {
    messages: {
      ext: () => 'Only PDF, DOC, and DOCX allowed',
      min: (name, ref) => 'Minimum characters of ' + name + ' is ' + ref[0],
      required: (name) => name + ' is a required field',
      dataTypeSelected: (name) => 'You must select the property field type from the dropdown',
      assetNameRequired: (name) => 'The Asset Property Name is required',
      assetRequired: (name) => 'You must make a selection for the Asset',
      assigneeRequired: (name) => 'You must make a selection for the Assignee'
    }
  }
};

export default erroren;
