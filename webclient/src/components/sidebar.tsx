import React, { Component } from 'react';
import { Container, Accordion, Text, Card, Center, Group, Divider, Anchor, Grid, Col, theming } from '@mantine/core';
import { createUseStyles } from 'react-jss';
import { Link } from 'react-router-dom';

const useStyles = createUseStyles(
  (theme) => ({
    sidebar: {
        zIndex: 999,
        background: "white",
        color: "#00",
        transition: "all 0.3s",
        minWidth: "250px",
        maxWidth: "250px",
        borderRight: "1px",
        borderRightColor: "#eee",
        borderRightStyle: "solid",
        minHeight: "100vh"
    }
  }),
  {theming}
);

interface SideBarProps {
    logo: string,
    twitter: string,
    github: string,
    docs: string,
    menu: {
        name: string,
        link?: string
        icon: React.ReactNode
        submenu?: {
            name: string,
            link: string
            icon?: React.ReactNode    
        }[]
    }[]
}

function SingleLink({item, divider}) {
    return <Card component={Link} to={item.link}>
    <Group style={{paddingBottom: 10}}>
        {item.icon}
        <Text>{item.name}</Text>
    </Group>
    <Card.Section>{divider && <Divider/>}</Card.Section>
    </Card>;
}

function SubitemLink({item}) {
    return <Group style={{paddingLeft: 35, paddingBottom: 10}}>
        {item.icon}
        <Text size="sm">{item.name}</Text>
    </Group>;
}

function NameWithIcon({name, icon}) {
    return <Group style={{paddingBottom: 0}}>
            {icon}
            <Text>{name}</Text>
        </Group>
}

export function Sidebar({logo, menu}: SideBarProps) {
    const classes = useStyles();

    return <div className={classes.sidebar} style={{paddingTop: 25}}>
            {menu.map((item,index)=>{
                if(item.link) { // last one show divider, and if next is a link show divider.
                    return <SingleLink item={item} divider={index+1 == menu.length ? true:  menu[index+1].link != null}/>
                } else {
                    return <Accordion>
                        <Accordion.Item label={<NameWithIcon name={item.name} icon={item.icon}/>}>
                            {item.submenu.map(submenu=> { return <SubitemLink item={submenu}/>})} 
                        </Accordion.Item>
                    </Accordion>
                }
            })}
    </div>
}