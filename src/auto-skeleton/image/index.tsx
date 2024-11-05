/*
 * 图片骨架屏
 * 
 * @Author: grayson<grayson.gao@bvox.com>
 * @Date: 2024-11-05 11:02:19
 * 
 * Copyright © 2019-2024 bvox.com. All Rights Reserved.
 */
import React from 'react';
import { comp_className } from '../../constants';
import '../index.scss';

export default function ImageSkeleton() {
    return (
        <div className={`${comp_className}auto-skeleton-image`}></div>
    )
}
