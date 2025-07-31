"use client";

import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { useCustomSidebar } from '../../context/SidebarContext';
import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../components/ui/sidebar";
import { cn } from "../../lib/utils";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from '../../lib/supabaseClient';

export function AppSidebar() {
  const { isCollapsed, toggleCollapse } = useCustomSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !isCollapsed) {
        toggleCollapse();
      } else if (window.innerWidth >= 768 && isCollapsed) {
        toggleCollapse();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isCollapsed, toggleCollapse]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navItems = [
    {
      name: "Discover",
      icon: "/DiscoverIcon.svg",
      activeIcon: "/DiscoverIcon.svg",
      url: "/dashboard/discover",
    },
    {
      name: "AI Search",
      icon: "/StarIcon.svg",
      activeIcon: "/StarIcon.svg",
      url: "/dashboard/ai-search",
    },
    {
      name: "My Lists",
      icon: "/MyListIcon.svg",
      activeIcon: "/MyListIcon.svg",
      hasCheck: true,
      url: "/dashboard/lists",
    },
    {
      name: "Outreach",
      icon: "/OutreachIcon.svg",
      activeIcon: "/OutreachIcon.svg",
      hasBadge: true,
      url: "/dashboard/outreach",
    },
  ].map((item) => ({
    ...item,
    isActive: pathname === item.url,
  }));

  const ICON_SIZE = 40; // px, for h-10 w-10

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      className={cn(
        "fixed top-0 left-0 z-50 h-screen transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[266px]",
      )}
    >
      <SidebarHeader className="px-4">
        <div
          className={`flex min-h-[40px] w-full items-center ${
            !isCollapsed ? "justify-between" : "justify-center"
          }`}
        >
          {!isCollapsed && (
            <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
              <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500">
                <Image
                  src="/frame-8.png"
                  alt="logo"
                  width={40}
                  height={40}
                  className="flex-shrink-0 rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <Image
                  src="/buzzberry-black-logo-1.png"
                  alt="logo"
                  width={80}
                  height={40}
                />
                <div className="flex h-3 items-center gap-1.5">
                  <div className="h-[7px] w-[7px] rounded-full bg-[#5f2ff2]" />
                  <div className="text-xs font-medium text-[#5f2ff2]">
                    free-trial
                  </div>
                </div>
              </div>
            </div>
          )}
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 flex-shrink-0 border-gray-200 p-2 hover:bg-gray-50 rounded-lg"
            onClick={() => toggleCollapse()}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5 text-gray-600" />
            )}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex h-full flex-col justify-between px-0">
        {/* Top navigation */}
        <div>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <Link
                      href={item.url}
                      className={cn(
                        "flex h-[44px] items-center rounded-lg",
                        !isCollapsed
                          ? "justify-start gap-2.5 px-3"
                          : "justify-center px-2",
                        item.isActive
                          ? "bg-gradient-to-r from-[#E7CBFD] to-[#E0DEEA] shadow-md"
                          : "hover:bg-gray-100",
                      )}
                    >
                      {item.icon && (
                        <div className="relative h-5 w-5">
                          <Image
                            src={item.isActive ? item.activeIcon : item.icon}
                            alt={item.name}
                            width={20}
                            height={20}
                            className="h-full w-full"
                          />
                        </div>
                      )}
                      {!isCollapsed && (
                        <div className="flex flex-1 items-center justify-between">
                          <span
                            className={cn(
                              "text-base font-medium",
                              item.isActive ? "text-black" : "text-gray-600",
                            )}
                          >
                            {item.name}
                          </span>
                          {item.hasBadge && (
                            <Badge className="bg-purple-50 text-[#5f2ff2]">
                              <div className="relative mr-1 h-3 w-3">
                                <Image
                                  src="/fire.svg"
                                  alt="Sparkle"
                                  width={12}
                                  height={12}
                                  className="h-full w-full"
                                />
                              </div>
                              New
                            </Badge>
                          )}
                        </div>
                      )}
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Bottom: Upgrade + Profile */}
        <div className="flex flex-col gap-2 px-3 pb-4">
          {!isCollapsed && (
            <Card className="w-full overflow-hidden border border-solid border-[#f1f4f8]">
              <div className="relative h-[120px] overflow-hidden">
                <Image
                  src="/gradient.jpg"
                  alt="gradient"
                  width={500}
                  height={200}
                />
              </div>
              <CardContent className="relative z-10 -mt-5 flex flex-col items-center gap-[15px] p-0">
                <div className="flex w-[200px] flex-col items-center gap-2">
                  <div className="aboslute relative z-20 mt-[-30px] flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border-[none] bg-[linear-gradient(222deg,rgba(150,65,48,1)_0%,rgba(132,51,156,1)_49%,rgba(96,47,242,1)_100%)] shadow-[0px_0px_0px_1px_#8158ff,0px_4px_8px_#b6a1f799]">
                    <Image
                      src="/buzzberry-icon-white-1.png"
                      alt="Upgrade icon"
                      width={18}
                      height={23}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex w-full flex-col items-center gap-2">
                    <h3 className="text-center text-xl leading-[24px] font-medium text-black">
                      Extend your outreach limit
                    </h3>
                    <p className="text-center text-[13px] leading-[15.6px] font-normal text-[#4e657f]">
                      Boost your campaigns by reaching out to more creators.
                    </p>
                  </div>
                </div>
                <div className="w-full p-2.5">
                  <Button className="h-[35px] w-full rounded-lg bg-[linear-gradient(271deg,rgba(57,78,102,1)_22%,rgba(23,42,65,1)_83%)] shadow-[0px_0px_0px_1px_#687d96,0px_4px_8px_#394e6640] hover:bg-[linear-gradient(271deg,rgba(57,78,102,0.9)_22%,rgba(23,42,65,0.9)_83%)]">
                    Upgrade
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div
            className={`flex w-full items-center ${
              !isCollapsed ? "justify-between" : "justify-center"
            }`}
          >
            {!isCollapsed ? (
              <>
                <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
                  <div className="min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] h-10 w-10 rounded-lg border border-gray-300 bg-gray-100 overflow-hidden">
                    {user?.user_metadata?.avatar_url ? (
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        width={ICON_SIZE}
                        height={ICON_SIZE}
                        className="min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="min-w-[30px] min-h-[30px] max-w-[40px] max-h-[40px] h-10 w-10 rounded-lg bg-purple-500 flex items-center justify-center text-white text-sm font-medium">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <span className="text-base font-medium whitespace-nowrap text-gray-900">
                    {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-8 w-8"
                >
                  <LogOut className="h-5 w-5 text-gray-500" />
                </Button>
              </>
            ) : (
              <div className="min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] h-10 w-10 rounded-lg border border-gray-300 bg-gray-100 overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    className="min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] h-10 w-10 rounded-lg bg-purple-500 flex items-center justify-center text-white text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
} 