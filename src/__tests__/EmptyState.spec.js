import React from 'react';
import { shallow, mount } from 'enzyme';
import { EmptyState } from '../';

describe('EmptyState', () => {
  it('should render children', () => {
    const emptyState = mount(<EmptyState>Yo!</EmptyState>);
    expect(emptyState.text()).toBe('Yo!');
  });
});
