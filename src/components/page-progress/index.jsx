'use client';
import Image from 'next/image';
import CustomButton from '../Button';
import PermissionWrapper from '@/components/wrapper/PermissionWrapper';

export default function PageProgressIcon({
  icon,
  title,
  description,
  buttonText,
  buttonAction,
  name = '',
  height = '60vh',
  border = true,
}) {
  return (
    <div
      className={`d-flex justify-content-center align-items-center flex-column page-placeholder ${
        !border ? 'border-0' : 'border-1'
      }`}
      style={{ height: height }}
    >
      <Image src={icon} width="100" alt="work in progress" />
      <h4 className="m-3">{title}</h4>
      <p className=" text-muted h5 fw-light mb-3">{description}</p>
      {buttonText && (
        <PermissionWrapper name={name}>
          <CustomButton variant="primary" onClick={buttonAction}>
            {buttonText}
          </CustomButton>
        </PermissionWrapper>
      )}
    </div>
  );
}
