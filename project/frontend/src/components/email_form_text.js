import Form from 'react-bootstrap/Form';



function EmailFormTextExample() {
  // const CustomTag = `h${this.props.level}`;
  return (
    <>
      {/* <CustomTag>Hello</CustomTag> */}
      <Form.Label htmlFor="inputEmail">Email</Form.Label>
      <Form.Control
        type="email"
        id="inputEmail"
        aria-describedby="emailHelpBlock"
      />
      {/* <Form.Text id="emailHelpBlock" muted> */}
        {/* Your password must be 8-20 characters long, contain letters and numbers, */}
        {/* and must not contain spaces, special characters, or emoji. */}
      {/* </Form.Text> */}
    </>
  );
}

export default EmailFormTextExample;