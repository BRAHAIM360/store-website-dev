import * as React from "react";
import { Grid, Placeholder } from "semantic-ui-react";
import { LinkV2 } from "src/components/link-v2";
import { Topic } from "t9entries/main/types/main-types";
import "./style";

export const Topics: React.FC<{ topics?: Topic[] }> = ({ topics }) => {
  return (
    <Grid className="topics" stackable={true} columns={topics ? topics.length as any : "2"}>
      {topics ?
        topics.map((topic, topicIndex) => (
          <Grid.Column key={"topic-" + topicIndex} >
            <div className="topic" style={{ backgroundImage: `url(${topic.image.url})` }}>
              <div>
                <div>
                  <div className="title">{topic.title}</div>
                  <div className="line" />
                  <div className="description">{topic.description}</div>
                  <br />
                  <LinkV2 to={topic.actionLink} className="action">{topic.actionText.toUpperCase()}</LinkV2>
                </div>
              </div>
            </div>
          </Grid.Column>
        )) :
        [1, 2].map((topic, topicIndex) => (
          <Grid.Column key={"topic-" + topicIndex} >
            <Placeholder style={{ margin: "3rem auto" }}>
              <Placeholder.Header image={true}>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Paragraph>
            </Placeholder>
          </Grid.Column>
        ))
      }
    </Grid>
  );
};
