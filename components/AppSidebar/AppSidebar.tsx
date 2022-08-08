import { Avatar, Button, Flex, Heading, Menu, MenuButton, MenuList, Text, useClipboard, VStack } from '@chakra-ui/react'
import { ChevronUpIcon, DuplicateIcon, LockClosedIcon } from '@heroicons/react/outline'
import { LogoutIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { FC, useEffect } from 'react'
import Blockies from 'react-blockies'
import CreateTransfer from '@components/CreateTransfer'
import MenuItem from './MenuItem'
import { useAppToast, useEthers } from '@hooks/index'
import getHiddenVersion from '@utils/getHiddenName'


/// THINGS WE NEED  (COLLAPSE AND ADDRESS)
interface AppSidebarProps {
  isCollapsed?: boolean
  address: string | null
}

const AppSidebar: FC<AppSidebarProps> = ({ isCollapsed = false, address }) => {
  const { onDisconnect } = useEthers()
  const { hasCopied, onCopy } = useClipboard(address || '')
  const toast = useAppToast()
  const stackSpacing = isCollapsed ? 4 : 1

  useEffect(() => {
    if (hasCopied) {
      toast.showToast('Address copied to clipboard', 'info')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCopied])

  return (
    <Flex pos="fixed" w={isCollapsed ? 14 : 52} bg="#F9F9F9" h="100vh" flexDir="column" justifyContent="space-between">
      <Flex flexDir="column">
        <Flex
          p="24px 16px 16px"
          alignItems="center"
          {...(isCollapsed && { justifyContent: 'center' })}
          borderBottom="1px solid #E5E7EB"
        >
          <Link href={{ pathname: '/' }}>
            <Avatar src="/logo.png" name={process.env.appName} size="xs" borderRadius="md" cursor="pointer" />
          </Link>
          {!isCollapsed && (
            <Heading ml="6px" as="h4" fontSize={12} mb={0}>
              {process.env.appName}
            </Heading>
          )}
        </Flex>
        <VStack px={2} mt={3} spacing={stackSpacing} alignItems="start">
          <CreateTransfer />
          {/* <MenuItem
            shortCutKeys={['Ctrl', 'K']}
            icon={SearchIcon}
            label="Search"
            isCollapsed={isCollapsed}
            onClick={() => {}}
          />
          <MenuItem icon={UserIcon} label="Menu item 1" isCollapsed={isCollapsed} />
          <MenuItem icon={UserIcon} label="Menu item 2" isCollapsed={isCollapsed} /> */}
          <MenuItem icon={LockClosedIcon} label="Safes" isCollapsed={isCollapsed} pathname="/safe" />
        </VStack>
      </Flex>
      <Flex px={2} pb={12} flexDir="column">
        {/* <MenuItem icon={UserIcon} label="Menu item 4" isCollapsed={isCollapsed} /> */}
        <Menu id="user-menu" matchWidth>
          <MenuButton
            w="full"
            as={Button}
            variant="ghost"
            p={1}
            mt={4}
            _hover={{ background: 'rgba(0, 0, 0, 0.04)' }}
            {...(!isCollapsed && {
              rightIcon: <ChevronUpIcon />,
            })}
          >
            <Flex
              alignItems="center"
              {...(isCollapsed && {
                justifyContent: 'center',
              })}
            >
              {address ? (
                <Blockies seed={address} color="orange" bgColor="gray" spotColor="yellow" />
              ) : (
                <Avatar size={isCollapsed ? 'xs' : 'sm'} borderRadius="md" name={process.env.appName} src="/logo.png" />
              )}
              {!isCollapsed && (
                <Flex flexDir="column" ml={2} alignItems="start">
                  <Heading maxW="124px" as="h4" size="xs" mb={0}>
                    {getHiddenVersion(address || '')}
                 
                  </Heading>
                  <Text maxW="124px" lineHeight="shorter" fontSize="smaller" color="gray.800" isTruncated>
                    Wallet Address
                  </Text>
                </Flex>
              )}
            </Flex>
          </MenuButton>
          <MenuList mb={3} p={2} minW="175px">
            <VStack spacing={1} alignItems="start">
              <MenuItem icon={DuplicateIcon} label="Copy address" onClick={onCopy} />
              <MenuItem icon={LogoutIcon} label="Disconnect" onClick={onDisconnect} />
            </VStack>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  )
}

export default AppSidebar
