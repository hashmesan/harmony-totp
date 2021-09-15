import { Button, Title, TextInput, NumberInput, Center, Group, 
        Divider, Modal, Text,Container, Card, Badge, Accordion, useMantineTheme } from '@mantine/core';
import React, { Component } from 'react';
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";

type Transaction = {
  from: string,
  to: string,
  value: string,
  params: Array<string>
}

type Message = {
  transactions: Array<Transaction>,
  gasFee: string,
  gasLimit: string,
  networkFee: string,
}

function Row({label, value}) {
  const theme = useMantineTheme();

  return (<Group position="apart" style={{marginTop: 5}}>
      <Text weight={500}>{label}</Text>
      <Text>{value}</Text>
    </Group>)
}

export var ConfirmModal = connect(null, actions)(function ({cancelConfirm, opened, tx: Transaction}) {

    return <Modal
        onClose={()=>cancelConfirm()}
        opened={opened} size="lg"
        title={<Center><Text>Transfer</Text></Center>}>
        <Center>
          <div style={{textAlign: "center"}}>
            <Title order={2}>-1.0 ONE</Title>
            <Text>~0.61</Text>
          </div>
        </Center>          
        <Card shadow="lg" padding="lg">
            <Row label="Asset" value="Harmony"/>
            <Card.Section><Divider /></Card.Section>
            <Row label="From" value="Me"/>
            <Card.Section><Divider /></Card.Section>
            <Row label="To" value="You"/>
        </Card>
        <Button size="lg" fullWidth={true} style={{marginTop: 30}}>Confirm</Button>
    </Modal>;
});


function Label({title, label, value}) {
  return (<Group position="apart">
          <Text weight={500}>{title}</Text>
          <div>
            <Badge variant="outline">{label}</Badge>&nbsp;
            <Badge variant="outline">{value} ONE</Badge>
          </div>
        </Group>)
}

export var ConfirmMulticall = connect(null, actions)(function ({cancelConfirm, opened, tx: Transaction}) {
  return <Modal
  onClose={()=>{cancelConfirm()}}
  opened={opened} size="lg"
  title={<Center><Text>Multicall</Text></Center>}>

  <Accordion  initialItem={-1}>
    <Accordion.Item label={<Label title="Swap" label="0x000" value="0"/>}> 
      <Card shadow="lg" padding="lg">
          <Row label="To" value="Me"/>
          <Card.Section><Divider /></Card.Section>
          <Row label="Value" value="You"/>
      </Card>    
    </Accordion.Item>
  </Accordion>
  <Card shadow="lg" padding="md">
    <Row label="Network fee" value="0.1"/>
  </Card>
  <Button size="lg" fullWidth={true} style={{marginTop: 30}}>Confirm</Button>
</Modal>;
})