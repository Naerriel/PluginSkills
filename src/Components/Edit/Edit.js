import React, { Component } from 'react';
import Skill from "../Skill/Skill.js";
import { AddNewSkillContainer } from "./AddNewSkill.js";

class Edit extends Component {
  constructor(props){
    super(props);

    this.state = { skills: props.skills };
  }

  componentWillReceiveProps(nextProps){
    this.setState({ skills: nextProps.skills });
  }

  render() {
    let skills = [];
    for (let i in this.state.skills){
      skills.push(<Skill skillInfo={this.state.skills[i]} edit={true} />);
    }
    return (
      <div>
        {skills}
        <AddNewSkillContainer />
      </div>
    );
  }
}

export default Edit;
