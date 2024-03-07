import { AugmentedPostPreview } from '@/types';

class ListNode {
  constructor(public value: AugmentedPostPreview, public next: ListNode | null = null) {}
}

export default ListNode;
