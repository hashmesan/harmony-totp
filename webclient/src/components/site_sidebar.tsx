import React, { Component } from 'react';
import { Sidebar } from './sidebar';
import { FaceIcon, HomeIcon, ImageIcon, SunIcon } from '@radix-ui/react-icons'
import { RiArrowLeftRightFill,RiStore2Fill, RiHome5Fill, RiSafeLine, RiInformationFill, RiMoreFill } from "react-icons/ri";

export function SiteSidebar() {
    return <Sidebar
                logo="/public/logo_smartvault.svg"
                github="https://github.com/hashmesan/harmony-totp"
                docs="https://github.com/hashmesan/harmony-totp/wiki/Developer-Guide"
                twitter="https://twitter.com"
                menu={[
                        {name: "Home", icon: <RiHome5Fill/>, link: "/wallet/assets"},
                        {name: "Assets", icon: <RiSafeLine/>, link: "/wallet/assets"},
                        {name: "Trade", icon: <RiArrowLeftRightFill/>,
                            submenu: [{
                                name: "Exchange",
                                link: "/wallet/viper"                                
                            }],
                        },
                        {name: "NFT", icon: <RiStore2Fill/>, link: "/wallet/assets"},
                        {name: "Info", icon: <RiInformationFill/>, link: "/stats"},
                        {name: "More", icon: <RiMoreFill/>,
                            submenu: [{
                                name: "Documentation",
                                link: "https://github.com/hashmesan/harmony-totp/wiki/Developer-Guide"                                
                            },
                            {
                                name: "Audit",
                                link: "https://github.com/hashmesan/harmony-totp/wiki/Developer-Guide"                                
                            }],
                        },
                    ]}
                    />
}