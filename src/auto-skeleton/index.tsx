/*
 * 自动化骨架屏组件
 *
 * @Author: grayson<grayson.gao@bvox.com>
 * @Date: 2024-10-11 09:39:50
 *
 * Copyright © 2019-2024 bvox.com. All Rights Reserved.
 */

import React, { useEffect, useRef, useState } from 'react';
import { comp_className } from '../constants';
import './index.scss';
import { Image, Text, imageTypes, textTypes } from './skeleton';
import { nanoid } from 'nanoid';

export interface IAutoSkeletonProps {
  /** 生成骨架屏完成 */
  onComplete?: () => void;
  /**
   * 加载中
   * @default true
   */
  loading: boolean;
  /** 加载完成回调 */
  onLoadingSuccess?: () => void;
}

function AutoSkeleton(props: IAutoSkeletonProps) {
  const { onComplete, loading = true, onLoadingSuccess } = props;
  const [showMenu, setShowMenu] = useState(false);
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const currentRef = useRef<HTMLDivElement>(null);
  const [skeleton, setSkeleton] = useState<any>();
  const genSkeleton = () => {
    if (!currentRef.current) return;
    const parent = currentRef.current.parentElement;
    if (!parent) return;
    /** 除了骨架屏内容以外的元素 */
    const targetElements = Array.from(parent.children).filter(
      (o) => !o.className.includes(comp_className + 'auto-skeleton'),
    );

    const getSkeletonSon = (elements: Element[], parent: Element) => {
      const child = elements
        .map((k) => {
          if (k.children.length > 0 && k.nodeName.toLowerCase() === 'div') {
            return getSkeletonSon(Array.from(k.children), k);
          }
          if (imageTypes.includes(k.nodeName.toLowerCase())) {
            return <Image key={nanoid()} />;
          }
          if (textTypes.includes(k.nodeName.toLowerCase())) {
            return <Text key={nanoid()} />;
          }

          return null;
        })
        .filter((k) => k !== null);
      const style = getComputedStyle(parent);
      return (
        <div
          key={nanoid()}
          style={{
            display: 'flex',
            width: style.width,
            flexDirection:
              style.flexDirection && style.display === 'flex'
                ? (style.flexDirection as any)
                : 'column',
            justifyContent: style.justifyContent,
            alignItems: style.alignItems,
            gap: style.gap === 'normal' ? '12px' : style.gap,
          }}
        >
          {child}
        </div>
      );
    };

    const getSkeletonChild = (elements: Element[]) => {
      return elements
        .map((o) => {
          if (o.children.length > 0 && o.nodeName.toLowerCase() === 'div') {
            return getSkeletonSon(Array.from(o.children), o);
          }
          if (imageTypes.includes(o.nodeName.toLowerCase())) {
            return <Image key={nanoid()} />;
          }
          if (textTypes.includes(o.nodeName.toLowerCase())) {
            return <Text key={nanoid()} />;
          }

          return null;
        })
        .filter((o) => o !== null);
    };

    const skeletonContent = getSkeletonChild(targetElements);

    setSkeleton(skeletonContent);
    setTimeout(() => {
      onComplete && onComplete();
      setShowMenu(false);
    }, 0);
  };

  useEffect(() => {
    if (loading) {
      genSkeleton();
    } else {
      onLoadingSuccess && onLoadingSuccess();
    }
  }, [loading]);

  const renderMenu = () => {
    return (
      <div
        className={`${comp_className}auto-skeleton-content-menu`}
        style={{ left: currentPoint.x, top: currentPoint.y }}
      >
        <div
          className={`${comp_className}auto-skeleton-content-menu-item`}
          onClick={genSkeleton}
        >
          生成骨架屏
        </div>
      </div>
    );
  };

  const handleMenu = (e: any) => {
    e.preventDefault();
    if (showMenu) return;
    /** 当前的point 便宜top 10px left 10px 生成菜单 */
    setCurrentPoint({ x: e.clientX + 10, y: e.clientY + 10 });
    setShowMenu(true);
  };

  useEffect(() => {
    const current = currentRef.current;
    if (current && current.parentElement) {
      /** 设置父元素的style为postion: relative */
      current.parentElement.style.position = 'relative';
    }
  }, []);

  const handleScroll = () => {
    setShowMenu(false);
  };

  /** 监听滚动事件 */
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = (e: any) => {
    /** 如果点击了菜单，则不隐藏菜单 */
    if (
      e.target.className.indexOf(
        `${comp_className}auto-skeleton-content-menu`,
      ) !== -1
    )
      return;
    setShowMenu(false);
  };

  return (
    loading && (
      <div
        className={`${comp_className}auto-skeleton`}
        onContextMenu={handleMenu}
        ref={currentRef}
        onClick={handleClick}
        style={{ position: skeleton ? 'relative' : 'absolute' }}
      >
        {skeleton}
        {showMenu && renderMenu()}
      </div>
    )
  );
}

export default AutoSkeleton;
