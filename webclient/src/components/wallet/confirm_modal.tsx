import { Button, Title, TextInput, NumberInput, Center, Group,  LoadingOverlay, Anchor,
        Divider, Modal, Text,Container, Card, Badge, Accordion, useMantineTheme, theming } from '@mantine/core';
import React, { Component,useState, useContext } from 'react';
import { connect } from "redux-zero/react";
import HarmonyClient from '../../../../lib/harmony_client';
import actions from "../../redux/actions";
const web3utils = require("web3-utils");
import { SmartVaultContext, SmartVaultConsumer } from "../smartvault_provider";
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles(
  (theme) => ({
    header: {
      width: '100%'
    }
  }),
  {theming}
);

type Transaction = {
  from: string,
  to: string,
  value: string,
  name: string,
  params: Map<string, any>
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

var ModalHeaderCenter = function(props) {
  const classes = useStyles();
  return <Modal {...props} classNames={{title: classes.header}}>{props.children}</Modal>
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
            <Badge variant="outline" size="lg" style={{textOverflow: "clip", maxWidth:"200px"}}>{label}</Badge>&nbsp;
            <Badge variant="outline" size="lg">{value} ONE</Badge>
          </div>
        </Group>)
}

export var ConfirmMulticall = connect(null, actions)(function ({cancelConfirm, opened, tx}) {
  const [visible, setVisible] = useState(false);
  const context = useContext(SmartVaultContext);
  const [success, setSuccess] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [error, setError] = useState(null);

  function confirmTx() {
    setVisible(true)
    context.smartvault.submitTransaction(tx.raw).then(res => {
      console.log("res=", res)
      setTxReceipt(res);
      setSuccess(res.success);
    }).catch((err) => {
      console.log("exception:", err)
      setTxReceipt({data: err.data});
      setSuccess(false);
      setError(err.message);
    });
  }

  const ConfirmPage = ()=> <ModalHeaderCenter
      onClose={()=>{cancelConfirm()}}
      opened={opened} size="lg"
      title={<Center style={{marginLeft: 20}}><Title order={2}>SmartContract Call</Title></Center>}>

      <LoadingOverlay visible={visible} />
      <Accordion  initialItem={-1}>
        {tx.transactions.map(e=>{

          // web3 returns structs, remove all the numeric keys
          const keys = Object.keys(e.params||{}).filter(e=>isNaN(parseInt(e)));

            return (<Accordion.Item label={<Label title={e.name} label={e.to} value={web3utils.fromWei(e.value.toString())}/>}> 
              <Card shadow="lg" padding="lg">
                  {keys.map((k,i)=>{
                    return (<><Row label={k} value={e.params[k].toString()}/>
                    {i!=keys.length-1 && <Card.Section><Divider /></Card.Section>}
                    </>)
                  })}
              </Card>    
            </Accordion.Item>
          );
        })}
      </Accordion>
      <Card shadow="lg" padding="md">
        <Row label="Network fee" value={tx.gasFee?.toString()}/>
      </Card>
      <Button size="lg" fullWidth={true} style={{marginTop: 30}} onClick={confirmTx}>Confirm</Button>
    </ModalHeaderCenter>;

  const SuccessPage =({tx, url}) =>
            <ModalHeaderCenter
                onClose={()=>{cancelConfirm()}}
                opened={opened} size="lg"
                title={<Center  style={{marginLeft: 20}}><Title color="blue" order={2}>SUCCESS</Title></Center>}>
                <Container >
                <Center style={{height: 300, textAlign: "center"}}>
                  <div>
                    <Text>TransactionHash</Text>
                    <Text  style={{marginBottom: 20}}>{tx}</Text>
                    <Anchor href={url} target="_blank">View on Explorer</Anchor>
                  </div>
                </Center>
                </Container>
            </ModalHeaderCenter>

  const ErrorPage = ({tx, error, url}) =>
            <ModalHeaderCenter
            onClose={()=>{cancelConfirm()}}
            opened={opened} size="lg"
            title={<Center  style={{marginLeft: 20}}><Title order={2} color="red">ERROR</Title></Center>}>
            <Container >
            <Center style={{height: 300, textAlign: "center"}}>
              <div>
                <Text style={{marginBottom: 20}}>Something went wrong. {error}</Text>
                <Text>TransactionHash</Text>
                <Text  style={{marginBottom: 20}}>{tx}</Text>
                <Anchor href={url} target="_blank">View on Explorer</Anchor>
              </div>
            </Center>
            </Container>
          </ModalHeaderCenter>


  if(success == true){
    var url = context.smartvault.config.EXPLORER_URL + "/tx/" + txReceipt.data.tx;
    return <SuccessPage tx={txReceipt.data.tx} url={url} />
  } else if(success == false) {
    var url = context.smartvault.config.EXPLORER_URL + "/tx/" + txReceipt.data.tx;
    return <ErrorPage error={error} tx={txReceipt?.data?.tx} url={url} />
  } else { //null
    return <ConfirmPage/>
  }
})

export function SmartConfirmModal(props) {

  var decoded = null
  if(props.confirmMessage) {
    decoded = HarmonyClient.decodeSmartVaultFunction(props.confirmMessage.raw);
    console.log("decoded?", decoded);
    return <ConfirmMulticall {...props} tx={{"transactions": decoded, ...props.confirmMessage}} />
  }
  return null;

  // if(props.tx && props.tx.length == 1) {
  //   return <ConfirmModal {...props} />
  // }  
  // else {
    
  // }
}

/*
{
    "success": true,
    "data": {
        "tx": "0x39453aad89ddff0f84799c07a5816faaa11c3977d00e42bc74f5910436fb06b5",
        "receipt": {
            "blockHash": "0x4b1207641ae251579319a720f4d5a8f76b2326c7ce157e9621d10984ed697aeb",
            "blockNumber": 14976265,
            "contractAddress": null,
            "cumulativeGasUsed": 80905,
            "from": "0x1727adcce8f11e7b9cbdd065e5ab64158f8bce3b",
            "gasUsed": 80905,
            "logs": [
                {
                    "address": "0xA7749ddd58D9640923BF3171Eee95F0148450574",
                    "blockHash": "0x4b1207641ae251579319a720f4d5a8f76b2326c7ce157e9621d10984ed697aeb",
                    "blockNumber": 14976265,
                    "logIndex": 0,
                    "removed": false,
                    "transactionHash": "0x39453aad89ddff0f84799c07a5816faaa11c3977d00e42bc74f5910436fb06b5",
                    "transactionIndex": 0,
                    "id": "log_d559c24e",
                    "event": "Deposit",
                    "args": {
                        "0": "0xF6BcAE23C58972C5Cd2eCf86248848b95b91Da50",
                        "1": "16345785d8a0000",
                        "__length__": 2,
                        "sender": "0xF6BcAE23C58972C5Cd2eCf86248848b95b91Da50",
                        "value": "16345785d8a0000"
                    }
                },
                {
                    "address": "0xF6BcAE23C58972C5Cd2eCf86248848b95b91Da50",
                    "blockHash": "0x4b1207641ae251579319a720f4d5a8f76b2326c7ce157e9621d10984ed697aeb",
                    "blockNumber": 14976265,
                    "logIndex": 1,
                    "removed": false,
                    "transactionHash": "0x39453aad89ddff0f84799c07a5816faaa11c3977d00e42bc74f5910436fb06b5",
                    "transactionIndex": 0,
                    "id": "log_61bc8678",
                    "event": "Invoked",
                    "args": {
                        "0": "0xA7749ddd58D9640923BF3171Eee95F0148450574",
                        "1": "16345785d8a0000",
                        "2": null,
                        "3": true,
                        "4": null,
                        "__length__": 5,
                        "target": "0xA7749ddd58D9640923BF3171Eee95F0148450574",
                        "value": "16345785d8a0000",
                        "data": null,
                        "success": true,
                        "returnData": null
                    }
                },
                {
                    "address": "0xF6BcAE23C58972C5Cd2eCf86248848b95b91Da50",
                    "blockHash": "0x4b1207641ae251579319a720f4d5a8f76b2326c7ce157e9621d10984ed697aeb",
                    "blockNumber": 14976265,
                    "logIndex": 2,
                    "removed": false,
                    "transactionHash": "0x39453aad89ddff0f84799c07a5816faaa11c3977d00e42bc74f5910436fb06b5",
                    "transactionIndex": 0,
                    "id": "log_11ed1ffd",
                    "event": "TransactionExecuted",
                    "args": {
                        "0": true,
                        "1": "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000",
                        "2": "0x0000000000000000000000000000000000000000000000000000000000000000",
                        "__length__": 3,
                        "success": true,
                        "returnData": "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000",
                        "signedHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
                    }
                }
            ],
            "logsBloom": "0x00000000000000400000000000000000008000000000100000000000000000000000000000000000000000000000000000000000000002000000000000040000000000400000000000000000000080000000000002040000000000008000000000000040008002000000000000001000000000000000000000000000000000000800000000000000000000000000000000000001010000000400000008000000000000001000000000000000000020000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000100000000000000400001008000000000",
            "status": true,
            "to": "0xf6bcae23c58972c5cd2ecf86248848b95b91da50",
            "transactionHash": "0x39453aad89ddff0f84799c07a5816faaa11c3977d00e42bc74f5910436fb06b5",
            "transactionIndex": 0,
            "rawLogs": [
                {
                    "address": "0xA7749ddd58D9640923BF3171Eee95F0148450574",
                    "blockHash": "0x4b1207641ae251579319a720f4d5a8f76b2326c7ce157e9621d10984ed697aeb",
                    "blockNumber": 14976265,
                    "data": "0x000000000000000000000000000000000000000000000000016345785d8a0000",
                    "logIndex": 0,
                    "removed": false,
                    "topics": [
                        "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c",
                        "0x000000000000000000000000f6bcae23c58972c5cd2ecf86248848b95b91da50"
                    ],
                    "transactionHash": "0x39453aad89ddff0f84799c07a5816faaa11c3977d00e42bc74f5910436fb06b5",
                    "transactionIndex": 0,
                    "id": "log_d559c24e"
                },
                {
                    "address": "0xF6BcAE23C58972C5Cd2eCf86248848b95b91Da50",
                    "blockHash": "0x4b1207641ae251579319a720f4d5a8f76b2326c7ce157e9621d10984ed697aeb",
                    "blockNumber": 14976265,
                    "data": "0x00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                    "logIndex": 1,
                    "removed": false,
                    "topics": [
                        "0x79ff2e3e6b1a9fd5afa9ad7b27b6075a3f05484916a94f800548947efa77e83b",
                        "0x000000000000000000000000a7749ddd58d9640923bf3171eee95f0148450574",
                        "0x000000000000000000000000000000000000000000000000016345785d8a0000"
                    ],
                    "transactionHash": "0x39453aad89ddff0f84799c07a5816faaa11c3977d00e42bc74f5910436fb06b5",
                    "transactionIndex": 0,
                    "id": "log_61bc8678"
                },
                {
                    "address": "0xF6BcAE23C58972C5Cd2eCf86248848b95b91Da50",
                    "blockHash": "0x4b1207641ae251579319a720f4d5a8f76b2326c7ce157e9621d10984ed697aeb",
                    "blockNumber": 14976265,
                    "data": "0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000",
                    "logIndex": 2,
                    "removed": false,
                    "topics": [
                        "0x8e2386b9ce82e5e79311687a54408ad06fa06a338e2057cdcdfaf3a076743f1e",
                        "0x0000000000000000000000000000000000000000000000000000000000000001"
                    ],
                    "transactionHash": "0x39453aad89ddff0f84799c07a5816faaa11c3977d00e42bc74f5910436fb06b5",
                    "transactionIndex": 0,
                    "id": "log_11ed1ffd"
                }
            ]
        },
        "logs": [
            {
                "address": "0xA7749ddd58D9640923BF3171Eee95F0148450574",
                "blockHash": "0x4b1207641ae251579319a720f4d5a8f76b2326c7ce157e9621d10984ed697aeb",
                "blockNumber": 14976265,
                "logIndex": 0,
                "removed": false,
                "transactionHash": "0x39453aad89ddff0f84799c07a5816faaa11c3977d00e42bc74f5910436fb06b5",
                "transactionIndex": 0,
                "id": "log_d559c24e",
                "event": "Deposit",
                "args": {
                    "0": "0xF6BcAE23C58972C5Cd2eCf86248848b95b91Da50",
                    "1": "16345785d8a0000",
                    "__length__": 2,
                    "sender": "0xF6BcAE23C58972C5Cd2eCf86248848b95b91Da50",
                    "value": "16345785d8a0000"
                }
            },
            {
                "address": "0xF6BcAE23C58972C5Cd2eCf86248848b95b91Da50",
                "blockHash": "0x4b1207641ae251579319a720f4d5a8f76b2326c7ce157e9621d10984ed697aeb",
                "blockNumber": 14976265,
                "logIndex": 1,
                "removed": false,
                "transactionHash": "0x39453aad89ddff0f84799c07a5816faaa11c3977d00e42bc74f5910436fb06b5",
                "transactionIndex": 0,
                "id": "log_61bc8678",
                "event": "Invoked",
                "args": {
                    "0": "0xA7749ddd58D9640923BF3171Eee95F0148450574",
                    "1": "16345785d8a0000",
                    "2": null,
                    "3": true,
                    "4": null,
                    "__length__": 5,
                    "target": "0xA7749ddd58D9640923BF3171Eee95F0148450574",
                    "value": "16345785d8a0000",
                    "data": null,
                    "success": true,
                    "returnData": null
                }
            },
            {
                "address": "0xF6BcAE23C58972C5Cd2eCf86248848b95b91Da50",
                "blockHash": "0x4b1207641ae251579319a720f4d5a8f76b2326c7ce157e9621d10984ed697aeb",
                "blockNumber": 14976265,
                "logIndex": 2,
                "removed": false,
                "transactionHash": "0x39453aad89ddff0f84799c07a5816faaa11c3977d00e42bc74f5910436fb06b5",
                "transactionIndex": 0,
                "id": "log_11ed1ffd",
                "event": "TransactionExecuted",
                "args": {
                    "0": true,
                    "1": "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000",
                    "2": "0x0000000000000000000000000000000000000000000000000000000000000000",
                    "__length__": 3,
                    "success": true,
                    "returnData": "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000",
                    "signedHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
                }
            }
        ]
    }
}*/