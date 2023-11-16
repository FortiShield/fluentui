import * as React from 'react';
import {
  getNativeElementProps,
  mergeCallbacks,
  useEventCallback,
  useMergedRefs,
  slot,
} from '@fluentui/react-utilities';
import { useNavContext } from '../NavContext';
import { NavGroupProps, NavGroupState } from './NavGroup.types';
import { SelectNavGroupEvent } from '../NavContext.types';

/**
 * Create the state required to render Tab.
 *
 * The returned state can be modified with hooks such as useTabStyles_unstable,
 * before being passed to renderTab_unstable.
 *
 * @param props - props from this instance of Tab
 * @param ref - reference to root HTMLButtonElement of Tab
 */
export const useNavGroup = (props: NavGroupProps, ref: React.Ref<HTMLButtonElement>): NavGroupState => {
  const { content, icon, onClick, value } = props;

  const selected = useNavContext(ctx => ctx.selectedValue === value);
  const onRegister = useNavContext(ctx => ctx.onRegister);
  const onUnregister = useNavContext(ctx => ctx.onUnregister);
  const onSelect = useNavContext(ctx => ctx.onSelect);

  const innerRef = React.useRef<HTMLElement>(null);
  const onNavGroupClick = useEventCallback(
    mergeCallbacks(onClick, (event: SelectNavGroupEvent) => onSelect(event, { value })),
  );

  React.useEffect(() => {
    onRegister({
      value,
      ref: innerRef,
    });

    return () => {
      onUnregister({ value, ref: innerRef });
    };
  }, [onRegister, onUnregister, innerRef, value]);

  const iconSlot = slot.optional(icon, { elementType: 'span' });
  const contentSlot = slot.always(content, {
    defaultProps: { children: props.children },
    elementType: 'span',
  });

  return {
    components: { root: 'button', icon: 'span', content: 'span', contentReservedSpace: 'span' },
    root: slot.always(
      getNativeElementProps('button', {
        ref: useMergedRefs(ref, innerRef),
        role: 'nav',
        type: 'navigation',
        ...props,
        onClick: onNavGroupClick,
      }),
      { elementType: 'button' },
    ),
    icon: iconSlot,
    content: contentSlot,
    contentReservedSpace: slot.optional(content, {
      defaultProps: { children: props.children },
      elementType: 'span',
    }),
    selected,
    value,
  };
};